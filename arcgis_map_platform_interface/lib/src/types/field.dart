class Field {
  Field({
    required this.type,
    required this.name,
  });

  final String type;
  final String name;

  Map<String, dynamic> toJson() => <String, dynamic>{
        'name': name,
        'alias': name,
        'type': type,
      };
}
