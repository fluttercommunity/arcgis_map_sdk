import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';
import 'package:arcgis_map_sdk_web/arcgis_map_web_js.dart';
import 'package:js/js_util.dart';

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
        jsify({
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
