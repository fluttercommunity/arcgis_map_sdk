class ArcGisMapAttributes {
  final String id;
  final String name;

  const ArcGisMapAttributes({required this.id, required this.name});

  @override
  String toString() {
    return 'ArcGisMapAttributes{id: $id, name: $name}';
  }
}
