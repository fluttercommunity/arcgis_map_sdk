import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/services.dart';

class ExportVectorTilesTask {
  static const _methodChannel =
      MethodChannel("esri.arcgis.flutter_plugin/export_vector_tiles_task");
  final String url;

  static Future<ExportVectorTilesTask> create({
    required String url,
  }) async {
    final instance = ExportVectorTilesTask._(url: url);

    await _methodChannel.invokeMethod(
      'create',
      {'hashCode': instance.hashCode, 'url': url},
    );
    return instance;
  }

  ExportVectorTilesTask._({required this.url});

  Future<void> load() async {
    return _methodChannel.invokeMethod('load', {'hashCode': hashCode});
  }

  Future<ExportVectorTilesParameters> createDefaultExportVectorTilesParameters({
    required Envelope areaOfInterest,
    required double maxScale,
  }) async {
    final result = await _methodChannel.invokeMethod(
      'create_default_export_vector_tiles_parameters',
      {
        'hashCode': hashCode,
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
