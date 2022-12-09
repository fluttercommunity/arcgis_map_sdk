class Field {
  final String type;
  final String name;

  Field({
    required this.type,
    required this.name,
  });

  @override
  String toString() {
    return 'Field{type: $type, name: $name}';
  }
}
