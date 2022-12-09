import 'dart:ui';

abstract class Symbol {
  Map<String, dynamic> toJson();

  Map<String, dynamic> toMethodChannelJson();
}

Map<String, dynamic> colorToJson(Color color) {
  return {
    'red': color.red,
    'green': color.green,
    'blue': color.blue,
    'alpha': color.alpha,
  };
}

/// A simple marker on the map
class SimpleMarkerSymbol implements Symbol {
  const SimpleMarkerSymbol({
    required this.color,
    this.colorOpacity = 1,
    required this.outlineColor,
    this.outlineColorOpacity = 1,
    this.outlineWidth = 2,
    this.radius = 4,
  });

  final Color color;
  final double colorOpacity;
  final Color outlineColor;
  final double outlineColorOpacity;
  final int outlineWidth;
  final int radius;

  @override
  Map<String, dynamic> toJson() => <String, dynamic>{
        'type': 'simple-marker',
        'color': [color.red, color.green, color.blue, colorOpacity],
        'size': radius,
        'outline': <String, dynamic>{
          'color': [
            outlineColor.red,
            outlineColor.green,
            outlineColor.blue,
            outlineColorOpacity
          ],
          'width': outlineWidth,
        },
      };

  @override
  Map<String, dynamic> toMethodChannelJson() => {
        'type': "simple-marker",
        'color': colorToJson(color),
        'colorOpacity': colorOpacity,
        'outlineColor': colorToJson(outlineColor),
        'outlineColorOpacity': outlineColorOpacity,
        'outlineWidth': outlineWidth,
        'radius': radius,
      };
}

/// A picture marker on the map
///
/// Add a [uri] of an image to display it as a marker in the whole feature layer
/// It can be a url or a local path, in which the image is stored locally
/// For example 'web/icons/Icon-192.png' or 'https://[someUrl].png'
///
/// [xOffset] The offset on the x-axis in pixels
/// [yOffset] The offset on the y-axis in pixels
class PictureMarkerSymbol implements Symbol {
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

  @override
  Map<String, dynamic> toJson() => <String, dynamic>{
        'type': 'picture-marker',
        'url': uri,
        'width': '${width}px',
        'height': '${height}px',
        'xoffset': '${xOffset}px',
        'yoffset': '${yOffset}px'
      };

  @override
  Map<String, dynamic> toMethodChannelJson() => {
        'type': 'picture-marker',
        'url': uri,
        'width': width,
        'height': height,
        'xOffset': xOffset,
        'yOffset': yOffset,
      };
}

/// Set the [fillColor] and other attributes of the polygon displayed in the map
class SimpleFillSymbol implements Symbol {
  const SimpleFillSymbol({
    required this.fillColor,
    required this.opacity,
    required this.outlineColor,
    required this.outlineWidth,
  });

  final Color fillColor;
  final double opacity;
  final Color outlineColor;
  final int outlineWidth;

  @override
  Map<String, dynamic> toJson() => <String, dynamic>{
        'type': 'simple-fill',
        'color': [fillColor.red, fillColor.green, fillColor.blue, opacity],
        'outline': {
          'color': [
            outlineColor.red,
            outlineColor.green,
            outlineColor.blue
          ], // White
          'width': outlineWidth
        }
      };

  @override
  Map<String, dynamic> toMethodChannelJson() => {
        'type': 'simple-fill',
        'fillColor': colorToJson(fillColor),
        'outlineColor': colorToJson(outlineColor),
        'outlineWidth': outlineWidth,
        'opacity': opacity,
      };
}

/// SimpleLineSymbol is used for rendering 2D polyline geometries in a 2D MapView.
/// SimpleLineSymbol is also used for rendering outlines for marker symbols and fill symbols.
///
/// https://developers.arcgis.com/javascript/latest/api-reference/esri-symbols-SimpleLineSymbol.html#style
class SimpleLineSymbol implements Symbol {
  const SimpleLineSymbol({
    this.cap = CapStyle.round,
    this.color,
    this.colorOpacity = 1,
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

  final double? colorOpacity;

  /// The name of the class.
  final String? declaredClass;

  /// Specifies the join style.
  final JoinStyle join;

  final LineSymbolMarker? marker;

  /// Maximum allowed ratio of the width of a miter join to the line width.
  final double? miterLimit;

  /// Specifies the line style.
  final PolylineStyle style;

  /// The width of the symbol in points.
  final double width;

  @override
  Map<String, dynamic> toJson() => <String, dynamic>{
        'cap': cap.value,
        'color': [color?.red, color?.green, color?.blue, colorOpacity],
        'declaredClass': declaredClass,
        'join': join.value,
        'marker': marker?.toJson(),
        'miterLimit': miterLimit,
        'style': style.value,
        'type': 'simple-line',
        // autocasts as new SimpleLineSymbol()
        'width': width,
      };

  @override
  Map<String, dynamic> toMethodChannelJson() => {
        'type': 'simple-line',
        'cap': cap.value,
        'color': colorToJson(color!),
        'colorOpacity': colorOpacity,
        'declaredClass': declaredClass,
        'join': join.value,
        'marker': marker?.toMethodChannelJson(),
        'miterLimit': miterLimit,
        'style': style.value,
        'width': width,
      };
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
    this.colorOpacity,
    this.declaredClass,
    this.placement = MarkerPlacement.beginEnd,
    this.style = MarkerStyle.arrow,
  });

  /// The color of the marker.
  final Color? color;

  final double? colorOpacity;

  /// The name of the class.
  final String? declaredClass;

  /// The placement of the marker(s) on the line.
  final MarkerPlacement placement;

  /// The marker style.
  final MarkerStyle style;

  Map<String, dynamic> toJson() => <String, dynamic>{
        'color': [color?.red, color?.green, color?.blue, colorOpacity],
        'declaredClass': declaredClass,
        'placement': placement.value,
        'style': style.value,
        'type': 'line-marker',
      };

  Map<String, dynamic> toMethodChannelJson() => {
        'type': 'line-symbol-marker',
        'color': colorToJson(color!),
        'colorOpacity': colorOpacity,
        'declaredClass': declaredClass,
        'placement': placement.name,
        'style': style.name,
      };
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
