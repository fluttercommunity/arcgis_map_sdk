import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/services.dart';

class ExportVectorTilesTask {
  // ignore: prefer_typing_uninitialized_variables
  late final _methodChannel;
  final String url;

  factory ExportVectorTilesTask({
    required String url,
  }) {
    final instance = ExportVectorTilesTask._(url: url);
    instance._methodChannel = MethodChannel(
      "esri.arcgis.flutter_plugin/export_vector_tiles_task/${instance.hashCode}",
    );
    instance._methodChannel.invokeMethod(
      'create',
      {'url': url},
    );
    return instance;
  }

  ExportVectorTilesTask._({required this.url});

  Future<void> load() async {
    return _methodChannel.invokeMethod('load');
  }

  Future<ExportVectorTilesParameters> createDefaultExportVectorTilesParameters({
    required Envelope areaOfInterest,
    required double maxScale,
  }) async {
    final result = await _methodChannel.invokeMethod(
      'create_default_export_vector_tiles_parameters',
      {
        'areaOfInterest': areaOfInterest.toMap(),
        'maxScale': maxScale,
      },
    ) as Map<String, dynamic>;
    return ExportVectorTilesParameters.fromMap(result);
  }

  Future<ExportVectorTilesParameters> exportVectorTiles({
    required ExportVectorTilesParameters exportVectorTilesParameters,
    required String vectorTileCachePath,
  }) async {
    final result = await _methodChannel.invokeMethod(
      'export_vector_tiles',
      {
        'exportVectorTilesParameters': exportVectorTilesParameters.toMap(),
        'vectorTileCachePath': vectorTileCachePath,
      },
    ) as Map<String, dynamic>;
    return ExportVectorTilesParameters.fromMap(result);
  }
}
