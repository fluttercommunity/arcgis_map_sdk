import "dart:js_util" as js_util;
import 'package:arcgis_map_web/arcgis_map_web.dart';

class EsriMap {
  const EsriMap();

  JsEsriMap init({dynamic basemap, List<String>? vectorTileLayerUrls}) {
    if (vectorTileLayerUrls != null && vectorTileLayerUrls.isNotEmpty) {
      return JsEsriMap(
        js_util.jsify({
          "basemap": JsBaseMap(
            js_util.jsify({
              'baseLayers': vectorTileLayerUrls.map(
                (String url) {
                  return JsVectorTileLayer(
                    js_util.jsify({
                      'url': url,
                    }),
                  );
                },
              ).toList(growable: false),
            }),
          )
        }),
      );
    } else {
      return JsEsriMap(
        js_util.jsify({"basemap": basemap}),
      );
    }
  }
}
