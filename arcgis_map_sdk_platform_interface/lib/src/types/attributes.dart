/// [Attributes] are fully configurable.
///
/// You can add any field according to your needs.
/// It is strongly advised to always include an [id] field.
class Attributes {
  final Map<String, dynamic> data;

  Attributes(this.data);

  String get id => data['id'] as String;
}
