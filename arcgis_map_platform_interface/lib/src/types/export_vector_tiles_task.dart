import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

class ExportVectorTilesTask {
  final String url;
  final int referenceHashCode;

  ExportVectorTilesTask._({
    required this.url,
    required this.referenceHashCode,
  });

  static Future<ExportVectorTilesTask> create({
    required String url,
  }) async {
    final refHashCode =
        await ArcgisMapPlatform.instance.createExportVectorTilesTask(url: url);
    return ExportVectorTilesTask._(url: url, referenceHashCode: refHashCode);
  }

  Future<void> startExportVectorTilesTaskJob({
    required ExportVectorTilesParameters parameters,
    required String vectorTileCachePath,
    required Function(int) onProgressChange,
  }) async {
    await ArcgisMapPlatform.instance.startExportVectorTilesTaskJob(
      task: this,
      parameters: parameters,
      vectorTileCachePath: vectorTileCachePath,
      onProgressChange: onProgressChange,
    );
  }

  @override
  // ignore: hash_and_equals
  int get hashCode => referenceHashCode;
}
