import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/services.dart';

class ExportVectorTilesJob {
  late final _methodChannel = MethodChannel(
    "esri.arcgis.flutter_plugin/export_vector_tiles_job/$hashCode",
  );

  final int _hashCode;

  ExportVectorTilesJob._({
    required int hashCode,
  }) : _hashCode = hashCode;

  @override
  // ignore: hash_and_equals
  int get hashCode => _hashCode;

  Map<String, dynamic> toMap() {
    return {
      'hashCode': hashCode,
    };
  }

  factory ExportVectorTilesJob.fromMap(Map<String, dynamic> map) {
    return ExportVectorTilesJob._(
      hashCode: map['hashCode'] as int,
    );
  }

  Future<void> start({
    required ExportVectorTilesParameters exportVectorTilesParameters,
    required String vectorTileCachePath,
    required Function(int progress)? onProgressChange,
  }) async {
    _methodChannel.setMethodCallHandler((call) async {
      if (call.method == 'progress') {
        final progress = call.arguments['progress'] as int;
        onProgressChange?.call(progress);
      }
    });
    await _methodChannel.invokeMethod(
      'start',
      {
        'exportVectorTilesParameters': exportVectorTilesParameters.toMap(),
        'vectorTileCachePath': vectorTileCachePath,
      },
    );
    _methodChannel.setMethodCallHandler(null);
  }
}
