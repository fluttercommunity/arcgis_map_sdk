class Point {
  final double x;
  final double y;

  const Point({
    required this.x,
    required this.y,
  });

  Map<String, dynamic> toMap() {
    return {
      'x': x,
      'y': y,
    };
  }

  factory Point.fromMap(Map<String, dynamic> map) {
    return Point(
      x: map['x'] as double,
      y: map['y'] as double,
    );
  }
}
