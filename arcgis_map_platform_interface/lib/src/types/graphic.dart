import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

abstract class Graphic {
  String getAttributesId();
  Map<String, dynamic> toJson();

  void Function()? get onEnter;
  void Function()? get onExit;
  void Function(bool isHovered)? get onHover;
}

/// The data on the map is displayed as points
class PointGraphic implements Graphic {
  const PointGraphic({
    required this.attributes,
    required this.latitude,
    required this.longitude,
    required this.symbol,
    this.onEnter,
    this.onExit,
    this.onHover,
  });

  final ArcGisMapAttributes attributes;
  final double latitude;
  final double longitude;
  final Symbol symbol;

  @override
  final void Function()? onEnter;

  @override
  final void Function()? onExit;

  @override
  final void Function(bool isHovered)? onHover;

  @override
  Map<String, dynamic> toJson() => <String, dynamic>{
        'geometry': <String, dynamic>{
          'type': 'point',
          'longitude': longitude,
          'latitude': latitude,
        },
        'attributes': attributes.toMap(),
        'symbol': symbol.toJson(),
      };

  @override
  String toString() =>
      'PointGraphic(longitude: $longitude, latitude: $latitude, attributes: $attributes)';

  @override
  String getAttributesId() => attributes.id;
}

/// The data on the map is displayed as polygons
class PolygonGraphic implements Graphic {
  const PolygonGraphic({
    required this.rings,
    required this.symbol,
    required this.attributes,
    this.onEnter,
    this.onExit,
    this.onHover,
  });

  /// Each list of LatLngs creates a polygon
  final List<List<List<double>>> rings;
  final Symbol symbol;
  final ArcGisMapAttributes attributes;

  @override
  final void Function()? onEnter;

  @override
  final void Function()? onExit;

  @override
  final void Function(bool isHovered)? onHover;

  @override
  Map<String, dynamic> toJson() => <String, dynamic>{
        'geometry': <String, dynamic>{
          'type': 'polygon',
          'rings': rings,
        },
        'symbol': symbol.toJson(),
        'attributes': attributes.toMap(),
      };

  @override
  String toString() =>
      'PolygonGraphic(rings: $rings, symbol: $symbol, attributes: $attributes)';

  @override
  String getAttributesId() => attributes.id;
}
