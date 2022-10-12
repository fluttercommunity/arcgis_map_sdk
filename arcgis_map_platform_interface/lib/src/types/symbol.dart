import 'dart:ui';

/// The currently supported marker symbols
enum SymbolType {
  simpleMarker,
  pictureMarker,
  simpleFill,
}

extension SymbolTypeExt on SymbolType {
  static const Map<SymbolType, String> values = {
    SymbolType.simpleMarker: 'simple-marker',
    SymbolType.pictureMarker: 'picture-marker',
    SymbolType.simpleFill: 'simple-fill',
  };

  String get value => values[this]!;
}

abstract class Symbol {
  Map<String, dynamic> toJson();
}

/// A simple marker on the map
class SimpleMarkerSymbol implements Symbol {
  const SimpleMarkerSymbol({
    required this.color,
    this.colorOpacity = 1,
    required this.outlineColor,
    this.outlineColorOpacity = 1,
    required this.outlineWidth,
  });

  final Color color;
  final double colorOpacity;
  final Color outlineColor;
  final double outlineColorOpacity;
  final int outlineWidth;

  @override
  Map<String, dynamic> toJson() => <String, dynamic>{
        'type': 'simple-marker',
        'color': [color.red, color.green, color.blue, colorOpacity],
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
}
