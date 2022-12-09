import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

extension AnimationOptionsJsonExtension on AnimationOptions {
  Map<String, Object?> toMap() {
    return {'duration': duration, 'animationCurve': animationCurve.name};
  }
}

extension ViewPaddingJsonExtension on ViewPadding {
  Map<String, Object?> toMap() {
    return {'left': left, 'top': top, 'right': right, 'bottom': bottom};
  }
}

extension LatLngJsonExtension on LatLng {
  Map<String, double> toMap() => {
        "longitude": longitude,
        "latitude": latitude,
      };
}

extension ArcgisMapOptionsJsonExtension on ArcgisMapOptions {
  Map<String, dynamic> toMap() {
    return <String, Object?>{
      'apiKey': apiKey,
      'basemap': basemap?.name,
      "vectorTilesUrls": vectorTilesUrls,
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
