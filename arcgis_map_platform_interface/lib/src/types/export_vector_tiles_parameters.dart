import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

class ExportVectorTilesParameters {
  final Envelope areaOfInterest;
  final int maxLevel;

  const ExportVectorTilesParameters({
    required this.areaOfInterest,
    required this.maxLevel,
  });

  Map<String, dynamic> toMap() {
    return {
      'areaOfInterest': areaOfInterest.toMap(),
      'maxLevel': maxLevel,
    };
  }
}
