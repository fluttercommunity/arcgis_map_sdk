import "dart:js_util" as js_util;
import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:arcgis_map_web/arcgis_map_web_js.dart';

class MapView {
  JsMapView init({
    dynamic container,
    dynamic map,
    required double zoom,
    required List<double> center,
    required bool rotationEnabled,
    required ViewPadding padding,
    required int minZoom,
    required int maxZoom,
    required double xMin,
    required double xMax,
    required double yMin,
    required double yMax,
  }) =>
      JsMapView(
        js_util.jsify({
          "container": container,
          "map": map,
          "center": center,
          "zoom": zoom,
          "padding": {
            "left": padding.left,
            "top": padding.top,
            "right": padding.right,
            "bottom": padding.bottom,
          },
          "constraints": {
            "rotationEnabled": rotationEnabled,
            "minZoom": minZoom,
            "maxZoom": maxZoom,
            "geometry": {
              "type": "extent",
              "xmin": xMin,
              "xmax": xMax,
              "ymin": yMin,
              "ymax": yMax,
            },
          },
        }),
      );
}
