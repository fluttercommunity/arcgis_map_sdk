import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

/// Options for the Arcgis map widget
///
/// [rotationEnabled] enables the rotation of the map by holding right click.
///
/// [xMin], [xMax], [yMin] and [yMax] are the coordinates of an extent envelope that constrains the panning in the map.
///
/// Warning!! If [hideAttribution] is set to true,
/// an attribution must still be provided, according to following layout and design guidelines from Esri
/// https://developers.arcgis.com/documentation/mapping-apis-and-services/deployment/basemap-attribution/#layout-and-design-guidelines
class ArcgisMapOptions {
  final String apiKey;
  final BaseMap basemap;
  final LatLng initialCenter;
  final bool isInteractive;
  final double zoom;
  final bool hideDefaultZoomButtons;
  final bool hideAttribution;
  final ViewPadding padding;
  final bool rotationEnabled;
  final int minZoom;
  final int maxZoom;
  final double xMin;
  final double xMax;
  final double yMin;
  final double yMax;

  const ArcgisMapOptions({
    required this.apiKey,
    required this.basemap,
    required this.initialCenter,
    required this.isInteractive,
    required this.zoom,
    required this.hideDefaultZoomButtons,
    required this.hideAttribution,
    required this.padding,
    required this.rotationEnabled,
    required this.minZoom,
    required this.maxZoom,
    required this.xMin,
    required this.xMax,
    required this.yMin,
    required this.yMax,
  });

  Map<String, dynamic> toMap() {
    return {
      'apiKey': apiKey,
      'basemap': basemap.name,
      'initialCenter': initialCenter.toMap(),
      'isInteractive': isInteractive,
      'zoom': zoom,
      'hideDefaultZoomButtons': hideDefaultZoomButtons,
      'hideAttribution': hideAttribution,
      'padding': padding.toMap(),
      'rotationEnabled': rotationEnabled,
      'minZoom': minZoom,
      'maxZoom': maxZoom,
      'xMin': xMin,
      'xMax': xMax,
      'yMin': yMin,
      'yMax': yMax,
    };
  }
}

// TODO move somewhere else
extension LatLngJsonExtension on LatLng {
  Map<String, Object?> toMap() =>
      {"longitude": longitude, "latitude": latitude};
}

/// To be added to the map to help re-centering the view.
///
/// This is particularly useful when the map is partially overlayed by other UI elements.
///
/// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-View.html#padding
class ViewPadding {
  final double left;
  final double top;
  final double right;
  final double bottom;

  const ViewPadding({
    this.left = 0,
    this.top = 0,
    this.right = 0,
    this.bottom = 0,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ViewPadding &&
          runtimeType == other.runtimeType &&
          left == other.left &&
          top == other.top &&
          right == other.right &&
          bottom == other.bottom;

  @override
  int get hashCode =>
      left.hashCode ^ top.hashCode ^ right.hashCode ^ bottom.hashCode;

  @override
  String toString() {
    return 'ViewPadding{left: $left, top: $top, right: $right, bottom: $bottom}';
  }

  Map<String, dynamic> toMap() {
    return {'left': left, 'top': top, 'right': right, 'bottom': bottom};
  }
}
