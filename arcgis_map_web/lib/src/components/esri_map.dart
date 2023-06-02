import "dart:js_util" as js_util;
import 'package:arcgis_map_web/arcgis_map_web_js.dart';
import 'package:arcgis_map_web/src/components/vector_layer.dart';

class EsriMap {
  const EsriMap();

  JsEsriMap init({
    dynamic basemap,
    dynamic ground,
    List<String>? vectorTileLayerUrls,
  }) {
    if (vectorTileLayerUrls != null && vectorTileLayerUrls.isNotEmpty) {
      return JsEsriMap(
        js_util.jsify({
          "basemap": JsBaseMap(
            js_util.jsify({
              'baseLayers': vectorTileLayerUrls.map(
                (String url) {
                  VectorLayer().init(url: url);
                },
              ).toList(growable: false),
            }),
          )
        }),
      );
    } else {
      return JsEsriMap(
        js_util.jsify({"basemap": basemap, "ground": ground}),
      );
    }
  }
}
