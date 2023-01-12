import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

class Envelope {
  final Point min;
  final Point max;

  const Envelope({
    required this.min,
    required this.max,
  });

  Map<String, dynamic> toMap() {
    return {
      'min': min.toMap(),
      'max': max.toMap(),
    };
  }

  factory Envelope.fromMap(Map<String, dynamic> map) {
    return Envelope(
      min: Point.fromMap(map['min'] as Map<String, dynamic>),
      max: Point.fromMap(map['max'] as Map<String, dynamic>),
    );
  }
}
