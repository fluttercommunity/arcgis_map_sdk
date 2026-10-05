import 'package:arcgis_map_sdk_web/arcgis_map_web_js.dart';
import 'package:arcgis_map_sdk_web/src/js_interop_utils.dart';

/// The attribution attached to the map view
class Attribution {
  JsAttribution init({dynamic view}) => JsAttribution(jsify({"view": view}));
}
