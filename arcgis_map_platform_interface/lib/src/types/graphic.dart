import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html
abstract class Graphic {
  const Graphic();

  String getAttributesId();

  void Function()? get onEnter;

  void Function()? get onExit;

  void Function(bool isHovered)? get onHover;

  R when<R>({
    required R Function(PointGraphic feature) ifPointGraphic,
    required R Function(PolylineGraphic feature) ifPolylineGraphic,
    required R Function(PolygonGraphic feature) ifPolygonGraphic,
  }) {
    final self = this;
    if (self is PointGraphic) {
      return ifPointGraphic(self);
    } else if (self is PolylineGraphic) {
      return ifPolylineGraphic(self);
    } else if (self is PolygonGraphic) {
      return ifPolygonGraphic(self);
    } else {
      throw Exception("Unknown graphic $self");
    }
  }
}

/// The data on the map is displayed as points
class PointGraphic extends Graphic {
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
  final Symbol symbol; //TODO: Only allow SimpleMarkerSymbol?

  @override
  final void Function()? onEnter;

  @override
  final void Function()? onExit;

  @override
  final void Function(bool isHovered)? onHover;

  @override
  String toString() =>
      'PointGraphic(longitude: $longitude, latitude: $latitude, attributes: $attributes)';

  @override
  String getAttributesId() => attributes.id;
}

/// The data on the map is displayed as polygons
class PolygonGraphic extends Graphic {
  const PolygonGraphic({
    required this.rings,
    required this.symbol,
    required this.attributes,
    this.onEnter,
    this.onExit,
    this.onHover,
  });

  /// Each list of LatLngs creates a polygon
  final List<List<LatLng>> rings;
  final Symbol symbol;
  final ArcGisMapAttributes attributes;

  @override
  final void Function()? onEnter;

  @override
  final void Function()? onExit;

  @override
  final void Function(bool isHovered)? onHover;

  @override
  String toString() =>
      'PolygonGraphic(rings: $rings, symbol: $symbol, attributes: $attributes)';

  @override
  String getAttributesId() => attributes.id;
}

/// The data on the map is displayed as polylines
///
/// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
///
/// Currently only supports [SimpleLineSymbol]
class PolylineGraphic extends Graphic {
  const PolylineGraphic({
    required this.paths,
    required this.symbol,
    required this.attributes,
    this.onEnter,
    this.onExit,
    this.onHover,
  });

  //TODO: update docs
  /// Each list of LatLongs creates a polyline
  ///
  /// An array of paths, or line segments, that make up the polyline.
  /// Each path is a two-dimensional array of numbers representing the coordinates of each vertex in the
  /// path in the spatial reference of the view. Each vertex is represented as an array of two, three, or four numbers.
  ///
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html#paths
  final List<LatLng> paths;
  final SimpleLineSymbol symbol;
  final ArcGisMapAttributes attributes;

  @override
  final void Function()? onEnter;

  @override
  final void Function()? onExit;

  @override
  final void Function(bool isHovered)? onHover;

  @override
  String toString() {
    return 'PolylineGraphic(paths: $paths, symbol: $symbol, attributes: $attributes)';
  }

  @override
  String getAttributesId() => attributes.id;
}
