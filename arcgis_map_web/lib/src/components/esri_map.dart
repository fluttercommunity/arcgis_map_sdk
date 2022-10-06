import "dart:js_util" as js_util;
import 'package:arcgis_map_web/arcgis_map_web.dart';

class EsriMap {
  const EsriMap();

  JsEsriMap init({dynamic basemap}) => JsEsriMap(
        js_util.jsify({"basemap": basemap}),
      );
}
