class ExportVectorTilesParameters {
  final int _hashCode;

  ExportVectorTilesParameters._({
    required int hashCode,
  }) : _hashCode = hashCode;

  @override
  // ignore: hash_and_equals
  int get hashCode => _hashCode;

  Map<String, dynamic> toMap() {
    return {
      'hashCode': hashCode,
    };
  }

  factory ExportVectorTilesParameters.fromMap(Map<String, dynamic> map) {
    return ExportVectorTilesParameters._(
      hashCode: map['hashCode'] as int,
    );
  }
}
