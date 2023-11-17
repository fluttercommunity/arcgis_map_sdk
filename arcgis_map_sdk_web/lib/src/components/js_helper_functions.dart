import 'dart:convert' show json;
import 'package:arcgis_map_web/arcgis_map_web_js.dart';

Map<String, dynamic> jsNativeObjectToMap(dynamic jsObject) =>
    json.decode(jsonStringify(jsObject) as String) as Map<String, dynamic>;
