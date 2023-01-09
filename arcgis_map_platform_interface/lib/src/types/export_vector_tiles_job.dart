import 'dart:async';

import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/services.dart';

class ExportVectorTilesJob {
  static late final _methodCallStream =
      StreamController<MethodCall>.broadcast();
  static late final _methodChannel = const MethodChannel(
    "esri.arcgis.flutter_plugin/export_vector_tiles_job",
  )..setMethodCallHandler((call) async {
      _methodCallStream.add(call);
    });

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
    final _subscription = _methodCallStream.stream.listen((event) {
      if (event.method == "progress" &&
          event.arguments["hashCode"] == hashCode) {
        final progress = event.arguments["progress"] as int;
        onProgressChange?.call(progress);
      }
    });
    await _methodChannel.invokeMethod(
      'start',
      {
        'hashCode': hashCode,
        'exportVectorTilesParameters': exportVectorTilesParameters.toMap(),
        'vectorTileCachePath': vectorTileCachePath,
      },
    );
    _subscription.cancel();
  }
}
