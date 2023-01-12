class Envelope {
  final double xMin;
  final double yMin;
  final double xMax;
  final double yMax;

  const Envelope({
    required this.xMin,
    required this.yMin,
    required this.xMax,
    required this.yMax,
  });

  Map<String, dynamic> toMap() {
    return {
      'xMin': xMin,
      'yMin': yMin,
      'xMax': xMax,
      'yMax': yMax,
    };
  }

  factory Envelope.fromMap(Map<String, dynamic> map) {
    return Envelope(
      xMin: map['xMin'] as double,
      yMin: map['yMin'] as double,
      xMax: map['xMax'] as double,
      yMax: map['yMax'] as double,
    );
  }
}
