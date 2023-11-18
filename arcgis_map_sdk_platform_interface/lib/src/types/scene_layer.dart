import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';

class SceneLayer {
  SceneLayer({
    this.id,
    this.data,
    this.onPressed,
    this.url,
    this.options,
    this.onChanged,
  });

  final String? id;
  final List<Graphic>? data;
  final void Function()? onPressed;
  final void Function(LatLng)? onChanged;
  final String? url;
  SceneLayerOptions? options;
}

class SceneLayerOptions {
  SceneLayerOptions({
    required this.symbol,
    this.elevationMode = ElevationMode.onTheGround,
  });

  final Symbol symbol;
  final ElevationMode elevationMode;
}
