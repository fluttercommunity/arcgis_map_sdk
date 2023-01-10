import 'dart:async';

import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

class ExportVectorTilesJob {
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
    required Function(int progress)? onProgressChange,
  }) async {
    await ArcgisMapPlatform.instance.startExportVectorTilesJob(
      job: this,
      onProgressChange: onProgressChange,
    );
  }
}
