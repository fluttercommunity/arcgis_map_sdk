import "dart:js_util" as js_util;

import 'package:arcgis_map_sdk_web/arcgis_map_web_js.dart';

/// The attribution attached to the map view
class Attribution {
  JsAttribution init({dynamic view}) => JsAttribution(
        js_util.jsify({"view": view}),
      );
}
