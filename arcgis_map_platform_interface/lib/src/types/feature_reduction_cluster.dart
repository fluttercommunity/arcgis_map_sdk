// TODO(Matthaios): Finish (https://github.com/phntmxyz/arcgis_map/issues/30)
class FeatureReductionCluster {
  Map<String, dynamic> toJson() => <String, dynamic>{
        'type': 'cluster',
        'clusterRadius': '100px',
        'popupTemplate': <String, dynamic>{},
        'clusterMinSize': '24px',
        'clusterMaxSize': '60px',
        'labelingInfo': <dynamic>[
          <String, dynamic>{
            'deconflictionStrategy': 'none',
            'labelExpressionInfo': <String, dynamic>{
              'expression': r'Text($feature.cluster_count, "#,###")',
            },
            'symbol': <String, dynamic>{
              'type': 'text',
              'color': 'white',
              'font': <String, dynamic>{
                'weight': 'bold',
                'family': 'Noto Sans',
                'size': '12px',
              },
            },
            'labelPlacement': 'center-center',
          }
        ],
      };
}
