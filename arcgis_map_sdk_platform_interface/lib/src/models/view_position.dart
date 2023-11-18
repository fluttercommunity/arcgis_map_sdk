/// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-ui-DefaultUI.html#move
/// Possible values:
/// bottom-leading"|"bottom-left"|"bottom-right"|"bottom-trailing"|"top-leading"|"top-left"|"top-right"|"top-trailing"|"manual"
enum WidgetPosition {
  bottomLeading('bottom-leading'),
  bottomLeft('bottom-left'),
  bottomRight('bottom-right'),
  bottomTrailing('bottom-trailing'),
  topLeading('top-leading'),
  topLeft('top-left'),
  topRight('top-right'),
  topTrailing('top-trailing'),
  manual('manual');

  const WidgetPosition(this.value);
  final String value;
}
