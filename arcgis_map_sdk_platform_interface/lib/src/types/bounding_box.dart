import 'dart:math';

import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';

/// The bounds of the visible view in map units
class BoundingBox {
  final double height;
  final double width;
  final LatLng topRight;
  final LatLng lowerLeft;

  BoundingBox({
    required this.height,
    required this.width,
    required this.topRight,
    required this.lowerLeft,
  });

  /// Returns the [LatLng] of a point given its relative position(x,y) to a reference point in map units
  ///
  /// Useful for calculating the bounding box of a view
  static LatLng getLatLngFromMapUnits({
    required LatLng referencePoint,
    required double x,
    required double y,
  }) {
    final distanceInMeter = sqrt(pow(x, 2) + pow(y, 2));
    final bearing = radianToDeg(atan2(x, y));
    return const Vincenty().offset(referencePoint, distanceInMeter, bearing);
  }
}
