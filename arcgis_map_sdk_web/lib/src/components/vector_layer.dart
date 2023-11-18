import 'package:arcgis_map_sdk_web/arcgis_map_web_js.dart';
import 'package:js/js_util.dart';

class VectorLayer {
  JsVectorTileLayer init({
    required String url,
    String? apiKey,
  }) {
    final Map<String, String> input = {'url': url};

    if (apiKey != null) {
      input['apiKey'] = apiKey;
    }

    return JsVectorTileLayer(jsify(input));
  }
}
