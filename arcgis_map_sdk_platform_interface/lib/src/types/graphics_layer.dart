import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';

class GraphicsLayer {
  GraphicsLayer({
    this.id,
    this.data,
    this.onPressed,
    this.options,
    this.onChanged,
  });

  final String? id;
  final List<Graphic>? data;
  final void Function()? onPressed;
  final void Function(LatLng)? onChanged;
  GraphicsLayerOptions? options;
}

class GraphicsLayerOptions {
  GraphicsLayerOptions({
    required this.fields,
    this.elevationMode = ElevationMode.onTheGround,
    this.featureReduction,
  });

  final List<Field> fields;
  final ElevationMode elevationMode;
  final Object? featureReduction;
}
