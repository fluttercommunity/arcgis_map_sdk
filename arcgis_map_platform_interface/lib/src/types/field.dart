class Field {
  Field({
    required this.type,
    required this.name,
  });

  final String type;
  final String name;

  @override
  String toString() {
    return 'Field{type: $type, name: $name}';
  }
}
