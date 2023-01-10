import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

class ExportVectorTilesTask {
  final String url;

  static Future<ExportVectorTilesTask> create({
    required String url,
  }) async {
    final instance = ExportVectorTilesTask._(url: url);
    await ArcgisMapPlatform.instance.createExportVectorTilesTask(
      task: instance,
      url: url,
    );
    return instance;
  }

  ExportVectorTilesTask._({required this.url});

  Future<void> load() async {
    await ArcgisMapPlatform.instance.loadExportVectorTilesTask(task: this);
  }

  Future<ExportVectorTilesParameters> createDefaultExportVectorTilesParameters({
    required Envelope areaOfInterest,
    required double maxScale,
  }) async {
    return ArcgisMapPlatform.instance.createDefaultExportVectorTilesParameters(
      task: this,
      areaOfInterest: areaOfInterest,
      maxScale: maxScale,
    );
  }

  Future<ExportVectorTilesJob> exportVectorTiles({
    required ExportVectorTilesParameters parameters,
    required String vectorTileCachePath,
  }) async {
    return ArcgisMapPlatform.instance.exportVectorTiles(
      task: this,
      parameters: parameters,
      vectorTileCachePath: vectorTileCachePath,
    );
  }
}
