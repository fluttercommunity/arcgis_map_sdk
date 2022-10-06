import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

class FeatureLayer {
  FeatureLayer({this.id, this.data, this.onPressed, this.url, this.options, this.onChanged});

  final String? id;
  final List<Graphic>? data;
  final void Function()? onPressed;
  final void Function(LatLng)? onChanged;
  final String? url;
  FeatureLayerOptions? options;
}

class FeatureLayerOptions {
  FeatureLayerOptions({
    required this.symbol,
    required this.fields,
    this.featureReduction,
  });

  final Symbol symbol;
  final List<Field> fields;
  //TODO: Change datatype
  final Object? featureReduction;
}
