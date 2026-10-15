import 'dart:js_interop';

import 'package:arcgis_map_sdk_web/arcgis_map_web_js.dart';

/// The attribution attached to the map view
class Attribution {
  JsAttribution init({dynamic view}) => JsAttribution(
        {"view": view}.jsify(),
      );
}
