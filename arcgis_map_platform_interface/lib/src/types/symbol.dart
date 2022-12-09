import 'dart:ui';

/// The currently supported marker symbols
enum SymbolType {
  simpleMarker,
  pictureMarker,
  simpleFill,
  simpleLine,
}

extension SymbolTypeExt on SymbolType {
  static const Map<SymbolType, String> values = {
    SymbolType.simpleMarker: 'simple-marker',
    SymbolType.pictureMarker: 'picture-marker',
    SymbolType.simpleFill: 'simple-fill',
    SymbolType.simpleLine: 'simple-line',
  };

  String get value => values[this]!;
}

abstract class Symbol {
  const Symbol();

  R when<R>({
    required R Function(SimpleFillSymbol symbol) ifSimpleFillSymbol,
    required R Function(SimpleMarkerSymbol symbol) ifSimpleMarkerSymbol,
    required R Function(PictureMarkerSymbol symbol) ifPictureMarkerSymbol,
    required R Function(SimpleLineSymbol symbol) ifSimpleLineSymbol,
  }) {
    final self = this;
    if (self is SimpleFillSymbol) {
      return ifSimpleFillSymbol(self);
    }
    if (self is SimpleMarkerSymbol) {
      return ifSimpleMarkerSymbol(self);
    }
    if (self is PictureMarkerSymbol) {
      return ifPictureMarkerSymbol(self);
    }
    if (self is SimpleLineSymbol) {
      return ifSimpleLineSymbol(self);
    }

    throw Exception("Unknown Symbol: $self");
  }
}

/// A simple marker on the map
class SimpleMarkerSymbol extends Symbol {
  const SimpleMarkerSymbol({
    required this.color,
    required this.outlineColor,
    this.outlineWidth = 2.0,
    this.size = 4.0,
  });

  final Color color;
  final Color outlineColor;
  final double outlineWidth;
  final double size;
}

/// A picture marker on the map
///
/// Add a [uri] of an image to display it as a marker in the whole feature layer
/// It can be a url or a local path, in which the image is stored locally
/// For example 'web/icons/Icon-192.png' or 'https://[someUrl].png'
///
/// [xOffset] The offset on the x-axis in pixels
/// [yOffset] The offset on the y-axis in pixels
class PictureMarkerSymbol extends Symbol {
  const PictureMarkerSymbol({
    required this.uri,
    required this.width,
    required this.height,
    this.xOffset = 0,
    this.yOffset = 0,
  });

  final String uri;
  final double width;
  final double height;
  final int xOffset;
  final int yOffset;
}

/// Set the [fillColor] and other attributes of the polygon displayed in the map
class SimpleFillSymbol extends Symbol {
  const SimpleFillSymbol({
    required this.fillColor,
    required this.outlineColor,
    required this.outlineWidth,
  });

  final Color fillColor;
  final Color outlineColor;
  final double outlineWidth;

  //TODO drop
  Map<String, dynamic> toJson() => <String, dynamic>{
        'type': 'simple-fill',
        'color': [
          fillColor.red,
          fillColor.green,
          fillColor.blue,
          fillColor.opacity
        ],
        'outline': {
          'color': [outlineColor.red, outlineColor.green, outlineColor.blue],
          'width': outlineWidth
        }
      };
}

/// SimpleLineSymbol is used for rendering 2D polyline geometries in a 2D MapView.
/// SimpleLineSymbol is also used for rendering outlines for marker symbols and fill symbols.
///
/// https://developers.arcgis.com/javascript/latest/api-reference/esri-symbols-SimpleLineSymbol.html#style
class SimpleLineSymbol extends Symbol {
  const SimpleLineSymbol({
    this.cap = CapStyle.round,
    this.color,
    this.declaredClass,
    this.join = JoinStyle.round,
    this.marker,
    this.miterLimit,
    this.style = PolylineStyle.solid,
    this.width = 0.75,
  });

  /// Specifies the cap style.
  final CapStyle cap;

  /// The color of the symbol.
  final Color? color;

  ///  The name of the class.
  final String? declaredClass;

  ///   Specifies the join style.
  final JoinStyle join;

  final LineSymbolMarker? marker;

  /// Maximum allowed ratio of the width of a miter join to the line width.
  final double? miterLimit;

  /// Specifies the line style.
  final PolylineStyle style;

  /// The width of the symbol in points.
  final double width;
}

/// Specifies the color, style, and placement of a symbol marker on the line.
///
/// LineSymbolMarker is used for rendering a simple marker graphic on a SimpleLineSymbol.
/// Markers can enhance the cartographic information of a line by providing additional visual cues about the associated feature.
///
/// https://developers.arcgis.com/javascript/latest/api-reference/esri-symbols-LineSymbolMarker.htm
class LineSymbolMarker {
  const LineSymbolMarker({
    this.color,
    this.declaredClass,
    this.placement = MarkerPlacement.beginEnd,
    this.style = MarkerStyle.arrow,
  });

  /// The color of the marker.
  final Color? color;

  /// The name of the class.
  final String? declaredClass;

  /// The placement of the marker(s) on the line.
  final MarkerPlacement placement;

  /// The marker style.
  final MarkerStyle style;
}

enum CapStyle {
  butt,
  round,
  square,
}

extension CapStyleExt on CapStyle {
  static const values = <CapStyle, String>{
    CapStyle.butt: 'butt',
    CapStyle.round: 'round',
    CapStyle.square: 'square',
  };

  String get value => values[this]!;
}

enum JoinStyle {
  miter,
  round,
  bevel,
}

extension JoinStyleExt on JoinStyle {
  static const values = <JoinStyle, String>{
    JoinStyle.miter: 'miter',
    JoinStyle.round: 'round',
    JoinStyle.bevel: 'bevel',
  };

  String get value => values[this]!;
}

enum MarkerPlacement {
  begin,
  end,
  beginEnd,
}

extension MarkerPlacementExt on MarkerPlacement {
  static const values = <MarkerPlacement, String>{
    MarkerPlacement.begin: 'begin',
    MarkerPlacement.end: 'end',
    MarkerPlacement.beginEnd: 'begin-end',
  };

  String get value => values[this]!;
}

enum MarkerStyle {
  arrow,
  circle,
  square,
  diamond,
  cross,
  x,
}

extension MarkerStyleExt on MarkerStyle {
  static const values = <MarkerStyle, String>{
    MarkerStyle.arrow: 'arrow',
    MarkerStyle.circle: 'circle',
    MarkerStyle.square: 'square',
    MarkerStyle.diamond: 'diamond',
    MarkerStyle.cross: 'cross',
    MarkerStyle.x: 'x',
  };

  String get value => values[this]!;
}

enum PolylineStyle {
  dash,
  dashDot,
  dot,
  longDash,
  longDashDot,
  longDashDotDot,
  none,
  shortDash,
  shortDashDot,
  shortDashDotDot,
  shortDot,
  solid,
}

extension PolylineStyleExt on PolylineStyle {
  static const Map<PolylineStyle, String> values = {
    PolylineStyle.dash: 'dash',
    PolylineStyle.dashDot: 'dash-dot',
    PolylineStyle.dot: 'dot',
    PolylineStyle.longDash: 'long-dash',
    PolylineStyle.longDashDot: 'long-dash-dot',
    PolylineStyle.longDashDotDot: 'long-dash-dot-dot',
    PolylineStyle.none: 'none',
    PolylineStyle.shortDash: 'short-dash',
    PolylineStyle.shortDashDot: 'short-dash-dot',
    PolylineStyle.shortDashDotDot: 'short-dash-dot-dot',
    PolylineStyle.shortDot: 'short-dot',
    PolylineStyle.solid: 'solid',
  };

  String get value => values[this]!;
}
