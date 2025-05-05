import 'package:arcgis_map_sdk_web/arcgis_map_web_js.dart';
import 'package:arcgis_map_sdk_web/src/components/vector_layer.dart';
import 'package:js/js_util.dart';

class EsriMap {
  const EsriMap();

  JsEsriMap init({
    dynamic basemap,
    dynamic ground,
    List<String>? vectorTileLayerUrls,
  }) {
    if (vectorTileLayerUrls != null && vectorTileLayerUrls.isNotEmpty) {
      return JsEsriMap(
        jsify({
          "basemap": JsBaseMap(
            jsify({
              'baseLayers': vectorTileLayerUrls.map(
                (String url) {
                  return VectorLayer().init(url: url);
                },
              ).toList(growable: false),
            }),
          ),
        }),
      );
    } else {
      return JsEsriMap(
        jsify({"basemap": basemap, "ground": ground}),
      );
    }
  }
}
