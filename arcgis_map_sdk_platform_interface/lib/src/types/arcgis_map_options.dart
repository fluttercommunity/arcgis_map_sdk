import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';

/// Options for the Arcgis map widget
///
/// [rotationEnabled] enables the rotation of the map by holding right click.
///
/// [xMin], [xMax], [yMin] and [yMax] are the coordinates of an extent envelope that constrains the panning in the map.
///
/// [isAttributionTextVisible] will hide the map attribution (e.g. the logo). Review the guidelines before disabling the attribution:
/// https://developers.arcgis.com/documentation/mapping-apis-and-services/deployment/basemap-attribution/#layout-and-design-guidelines
class ArcgisMapOptions {
  final String? apiKey;
  final String? licenseKey;
  final MapStyle mapStyle;
  final LatLng initialCenter;
  final bool showLabelsBeneathGraphics;
  final bool isInteractive;
  final double zoom;
  final double tilt;
  final double initialHeight;
  final double heading;
  final ViewPadding padding;
  final bool rotationEnabled;
  final int minZoom;
  final int maxZoom;
  final double xMin;
  final double xMax;
  final double yMin;
  final double yMax;
  final BaseMap? basemap;
  final Ground? ground;
  final List<String>? vectorTilesUrls;
  final List<DefaultWidget> defaultUiList;
  final bool isPopupEnabled;
  final bool? isAttributionTextVisible;

  const ArcgisMapOptions({
    required this.apiKey,
    required this.licenseKey,
    required this.mapStyle,
    required this.initialCenter,
    required this.isInteractive,
    required this.showLabelsBeneathGraphics,
    required this.zoom,
    required this.tilt,
    required this.initialHeight,
    required this.heading,
    required this.padding,
    required this.rotationEnabled,
    required this.minZoom,
    required this.maxZoom,
    required this.xMin,
    required this.xMax,
    required this.yMin,
    required this.yMax,
    required this.defaultUiList,
    this.basemap,
    this.ground,
    this.vectorTilesUrls,
    this.isPopupEnabled = false,
    this.isAttributionTextVisible,
  });

  @override
  String toString() {
    return 'ArcgisMapOptions{apiKey: $apiKey, licenseKey: $licenseKey, mapStyle: $mapStyle, initialCenter: $initialCenter, showLabelsBeneathGraphics: $showLabelsBeneathGraphics, isInteractive: $isInteractive, zoom: $zoom, tilt: $tilt, initialHeight: $initialHeight, heading: $heading, padding: $padding, rotationEnabled: $rotationEnabled, minZoom: $minZoom, maxZoom: $maxZoom, xMin: $xMin, xMax: $xMax, yMin: $yMin, yMax: $yMax, basemap: $basemap, ground: $ground, vectorTilesUrls: $vectorTilesUrls, defaultUiList: $defaultUiList, isPopupEnabled: $isPopupEnabled, isAttributionTextVisible: $isAttributionTextVisible}';
  }
}

// Define MapStyle -- 3D => SceneLayer ; 2D => MapLayer
enum MapStyle {
  threeD,
  twoD,
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

  ViewPadding copyWith({
    double? left,
    double? top,
    double? right,
    double? bottom,
  }) {
    return ViewPadding(
      left: left ?? this.left,
      top: top ?? this.top,
      right: right ?? this.right,
      bottom: bottom ?? this.bottom,
    );
  }
}
