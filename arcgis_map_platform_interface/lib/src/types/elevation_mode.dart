/// The currently supported elevation modes for [FeatureLayer] & [GraphicsLayer].
/// See: https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#elevationInfo
enum ElevationMode {
  onTheGround,
  absoluteHeight,
  relativeToGround,
  relativeToScene,
}

extension SElevationModeExt on ElevationMode {
  static const Map<ElevationMode, String> values = {
    ElevationMode.onTheGround: 'on-the-ground',
    ElevationMode.absoluteHeight: 'absolute-height',
    ElevationMode.relativeToGround: 'relative-to-ground',
    ElevationMode.relativeToScene: 'relative-to-scene',
  };

  String get value => values[this]!;
}
