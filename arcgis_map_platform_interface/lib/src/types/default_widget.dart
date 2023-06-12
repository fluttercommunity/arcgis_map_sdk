import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

/// The default UI widgets attached to the map.
///
/// See: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-ui-DefaultUI.html#components
class DefaultWidget {
  DefaultWidget({
    required this.viewType,
    required this.position,
  });

  final DefaultWidgetType viewType;
  final WidgetPosition position;
}

enum DefaultWidgetType {
  zoom("zoom"),
  compass("compass"),
  attribution("attribution"),
  navigationToggle("navigation-toggle");

  const DefaultWidgetType(this.value);
  final String value;
}
