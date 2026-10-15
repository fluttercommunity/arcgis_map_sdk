import 'dart:js_interop';

import 'package:arcgis_map_sdk_web/arcgis_map_web_js.dart';
import 'package:arcgis_map_sdk_web/src/components/vector_layer.dart';

class EsriMap {
  const EsriMap();

  JsEsriMap init({
    dynamic basemap,
    dynamic ground,
    List<String>? vectorTileLayerUrls,
  }) {
    if (vectorTileLayerUrls != null && vectorTileLayerUrls.isNotEmpty) {
      return JsEsriMap(
        {
          "basemap": JsBaseMap(
            {
              'baseLayers': vectorTileLayerUrls.map(
                (String url) {
                  return VectorLayer().init(url: url);
                },
              ).toList(growable: false),
            }.jsify(),
          ),
        }.jsify(),
      );
    } else {
      return JsEsriMap(
        {"basemap": basemap, "ground": ground}.jsify(),
      );
    }
  }
}
