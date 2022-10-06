class ArcGisMapAttributes {
  final String id;
  final String name;

  const ArcGisMapAttributes({required this.id, required this.name});

  Map<String, Object> toMap() {
    return <String, Object>{
      'id': id,
      'name': name,
    };
  }

  ArcGisMapAttributes.fromMap(Map<String, Object> map)
      : id = map['id'].toString(),
        name = map['name'].toString();
}
