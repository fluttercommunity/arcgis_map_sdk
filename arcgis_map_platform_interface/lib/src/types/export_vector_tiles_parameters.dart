class ExportVectorTilesParameters {
  final int _referenceHashCode;

  ExportVectorTilesParameters._({
    required int referenceHashCode,
  }) : _referenceHashCode = referenceHashCode;

  @override
  // ignore: hash_and_equals
  int get hashCode => _referenceHashCode;

  Map<String, dynamic> toMap() {
    return {
      'referenceHashCode': _referenceHashCode,
    };
  }

  factory ExportVectorTilesParameters.fromMap(Map<String, dynamic> map) {
    return ExportVectorTilesParameters._(
      referenceHashCode: map['_referenceHashCode'] as int,
    );
  }
}
