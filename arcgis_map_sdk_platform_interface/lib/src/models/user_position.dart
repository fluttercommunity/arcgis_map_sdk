import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';

class UserPosition {
  final LatLng latLng;
  final double? accuracy;
  final double? heading;

  const UserPosition({
    required this.latLng,
    required this.accuracy,
    this.heading,
  });
}
