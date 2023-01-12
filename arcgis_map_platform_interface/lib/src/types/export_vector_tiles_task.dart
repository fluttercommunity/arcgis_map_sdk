import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/foundation.dart';

class ExportVectorTilesTask {
  final String id;
  final String url;

  ExportVectorTilesTask._({
    required this.id,
    required this.url,
  });

  static Future<ExportVectorTilesTask> create({
    required String url,
  }) async {
    final instance = ExportVectorTilesTask._(
      url: url,
      id: UniqueKey().toString(),
    );
    await ArcgisMapPlatform.instance
        .createExportVectorTilesTask(task: instance);
    return instance;
  }

  Future<void> startExportVectorTilesTaskJob({
    required ExportVectorTilesParameters parameters,
    required String vectorTileCachePath,
    required Function(int) onProgressChange,
  }) async {
    await ArcgisMapPlatform.instance.startExportVectorTilesTaskJob(
      taskId: id,
      parameters: parameters,
      vectorTileCachePath: vectorTileCachePath,
      onProgressChange: onProgressChange,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'url': url,
    };
  }
}
