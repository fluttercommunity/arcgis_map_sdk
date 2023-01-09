import 'dart:math';

class Envelope {
  final Point<double> min;
  final Point<double> max;

  const Envelope({
    required this.min,
    required this.max,
  });

  Map<String, dynamic> toMap() {
    return {
      'min': min,
      'max': max,
    };
  }
}
