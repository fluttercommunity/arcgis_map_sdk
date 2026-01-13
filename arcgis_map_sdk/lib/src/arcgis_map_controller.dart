import 'package:arcgis_map_sdk/src/arcgis_location_display.dart';
import 'package:arcgis_map_sdk/src/model/map_status.dart';
import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';
import 'package:flutter/services.dart';

typedef MapStatusListener = void Function(MapStatus status);

class ArcgisMapController {
  ArcgisMapController._({
    required this.mapId,
  }) : _locationDisplay = ArcgisLocationDisplay(mapId: mapId) {
    ArcgisMapPlatform.instance.setMethodCallHandler(
      mapId: mapId,
      onCall: _onCall,
    );
  }

  final int mapId;

  late ArcgisLocationDisplay _locationDisplay;

  ArcgisLocationDisplay get locationDisplay => _locationDisplay;

  final _listeners = <MapStatusListener>[];
  MapStatus _mapStatus = MapStatus.unknown;

  MapStatus get mapStatus => _mapStatus;

  static Future<ArcgisMapController> init(
    int id,
  ) async {
    await ArcgisMapPlatform.instance.init(id);
    return ArcgisMapController._(mapId: id);
  }

  Future<FeatureLayer> addFeatureLayer({
    required String layerId,
    required FeatureLayerOptions options,
    List<Graphic>? data,
    void Function(dynamic)? onPressed,
    String? url,
    void Function(double)? getZoom,
  }) {
    return ArcgisMapPlatform.instance.addFeatureLayer(
      options,
      data,
      onPressed,
      url,
      mapId,
      getZoom,
      layerId,
    );
  }

  /// Exports an image of the currently visible map view containing all
  /// layers of that view.
  Future<Uint8List> exportImage() {
    return ArcgisMapPlatform.instance.exportImage(mapId);
  }

  Future<GraphicsLayer> addGraphicsLayer({
    required String layerId,
    required GraphicsLayerOptions options,
    void Function(dynamic)? onPressed,
  }) {
    return ArcgisMapPlatform.instance.addGraphicsLayer(
      options,
      mapId,
      layerId,
      onPressed,
    );
  }

  Future<SceneLayer> addSceneLayer({
    required String layerId,
    required String url,
    required SceneLayerOptions options,
  }) {
    return ArcgisMapPlatform.instance.addSceneLayer(
      options: options,
      layerId: layerId,
      url: url,
      mapId: mapId,
    );
  }

  Future<void> _onCall(MethodCall call) async {
    final method = call.method;
    switch (method) {
      case "onStatusChanged":
        return _notifyStatusChanged(call);
      default:
        throw UnimplementedError('Method "$method" not implemented');
    }
  }

  Stream<double> getZoom() {
    return ArcgisMapPlatform.instance.getZoom(mapId);
  }

  void switchMapStyle(MapStyle mapStyle) {
    ArcgisMapPlatform.instance.switchMapStyle(mapId, mapStyle);
  }

  Stream<LatLng> centerPosition() {
    return ArcgisMapPlatform.instance.centerPosition(mapId);
  }

  Stream<List<String>> visibleGraphics() {
    return ArcgisMapPlatform.instance.visibleGraphics(mapId);
  }

  Stream<BoundingBox> getBounds() {
    return ArcgisMapPlatform.instance.getBounds(mapId);
  }

  Stream<String> attributionText() {
    return ArcgisMapPlatform.instance.attributionText(mapId);
  }

  Stream<Attributes?> onClickListener() {
    return ArcgisMapPlatform.instance.onClickListener(mapId);
  }

  void setMouseCursor(SystemMouseCursor cursor) {
    ArcgisMapPlatform.instance.setMouseCursor(cursor, mapId);
  }

  void updateGraphicSymbol({
    required String layerId,
    required String graphicId,
    required Symbol symbol,
  }) {
    ArcgisMapPlatform.instance.updateGraphicSymbol(
      mapId: mapId,
      layerId: layerId,
      symbol: symbol,
      graphicId: graphicId,
    );
  }

  Future<void> updateFeatureLayer({
    required String featureLayerId,
    required List<Graphic> data,
  }) {
    return ArcgisMapPlatform.instance.updateFeatureLayer(
      mapId: mapId,
      data: data,
      featureLayerId: featureLayerId,
    );
  }

  bool destroyLayer({required String layerId}) {
    return ArcgisMapPlatform.instance
        .destroyLayer(layerId: layerId, mapId: mapId);
  }

  bool polygonContainsPoint({
    required String polygonId,
    required LatLng pointCoordinates,
  }) {
    return ArcgisMapPlatform.instance.polygonContainsPoint(
      polygonId: polygonId,
      pointCoordinates: pointCoordinates,
      mapId: mapId,
    );
  }

  Future<void> moveCamera({
    required LatLng point,
    double? zoomLevel,
    int? threeDHeading,
    int? threeDTilt,
    AnimationOptions? animationOptions,
  }) {
    return ArcgisMapPlatform.instance.moveCamera(
      mapId: mapId,
      point: point,
      zoomLevel: zoomLevel,
      threeDHeading: threeDHeading,
      threeDTilt: threeDTilt,
      animationOptions: animationOptions,
    );
  }

  /// Moves the camera to the provided [points] and makes sure that all of
  /// them are visible.
  /// Currently, [padding] is only supported on mobile.
  Future<void> moveCameraToPoints({
    required List<LatLng> points,
    double? padding,
  }) {
    return ArcgisMapPlatform.instance.moveCameraToPoints(
      mapId: mapId,
      points: points,
      padding: padding,
    );
  }

  /// Adds a listener that gets notified if the map status changes.
  /// The listener can be removed by calling the [VoidCallback] returned by this function.
  VoidCallback addStatusChangeListener(MapStatusListener listener) {
    _listeners.add(listener);
    return () => _listeners.removeWhere((l) => l == listener);
  }

  /// Calling native `retryLoadAsync` (android) and `retryLoad` (swift)
  /// https://developers.arcgis.com/kotlin/api-reference/arcgis-maps-kotlin/com.arcgismaps/-loadable/retry-load.html
  /// This does not trigger `onMapCreated` since it will only try, if there is an error
  Future<void> retryLoad() {
    return ArcgisMapPlatform.instance.retryLoad(mapId);
  }

  void _notifyStatusChanged(MethodCall call) {
    _mapStatus = MapStatus.values.byName(call.arguments as String);
    for (final listener in _listeners) {
      listener(_mapStatus);
    }
  }

  Future<void> setInteraction({required bool isEnabled}) {
    return ArcgisMapPlatform.instance
        .setInteraction(mapId, isEnabled: isEnabled);
  }

  Future<bool> zoomIn({
    required int lodFactor,
    AnimationOptions? animationOptions,
  }) {
    return ArcgisMapPlatform.instance.zoomIn(
      lodFactor: lodFactor,
      mapId: mapId,
      animationOptions: animationOptions,
    );
  }

  Future<bool> zoomOut({
    required int lodFactor,
    AnimationOptions? animationOptions,
  }) {
    return ArcgisMapPlatform.instance.zoomOut(
      lodFactor: lodFactor,
      mapId: mapId,
      animationOptions: animationOptions,
    );
  }

  Future<void> setRotation(double angleDegrees) {
    return ArcgisMapPlatform.instance.setRotation(angleDegrees, mapId);
  }

  Future<void> addGraphic({required String layerId, required Graphic graphic}) {
    return ArcgisMapPlatform.instance.addGraphic(mapId, layerId, graphic);
  }

  Future<void> removeGraphic({
    required String layerId,
    required String objectId,
  }) {
    return ArcgisMapPlatform.instance.removeGraphic(mapId, layerId, objectId);
  }

  /// Removes the [Graphic]s from a specific [GraphicsLayer], given their [removeByAttributeKey] with an [removeByAttributeValue].
  /// If in this selection, there are [Graphic]s that should not be deleted,
  /// you cannot remove them using the key-value pair [excludeAttributeKey] with [excludeAttributeValues].
  ///
  /// For example, you want to remove all pins in the map, except the selected pin, then you remove the pin family
  /// and keep the selected pin using its id.
  ///
  /// If [removeByAttributeKey] is null, all graphics are removed.
  ///
  ///
  /// For example, you want to remove all pins in the map of 'type' : 'pin', except the pins with the id
  /// 'basePin01' and 'highlightPin04', then write the following function.
  ///
  /// ```dart
  ///  controller.removeGraphics(
  ///   removeByAttributeKey: 'type',
  ///   removeByAttributeValue: 'pin',
  ///   excludeAttributeKey: 'id',
  ///   excludeAttributeValues: ['basePin01', 'highlightPin04'],
  ///   );
  /// ```
  ///
  void removeGraphics({
    String? layerId,
    String? removeByAttributeKey,
    String? removeByAttributeValue,
    String? excludeAttributeKey,
    List<String>? excludeAttributeValues,
  }) {
    ArcgisMapPlatform.instance.removeGraphics(
      mapId: mapId,
      layerId: layerId,
      removeByAttributeKey: removeByAttributeKey,
      removeByAttributeValue: removeByAttributeValue,
      excludeAttributeKey: excludeAttributeKey,
      excludeAttributeValues: excludeAttributeValues,
    );
  }

  void addViewPadding({required ViewPadding padding}) {
    ArcgisMapPlatform.instance.addViewPadding(mapId, padding);
  }

  Future<void> toggleBaseMap({required BaseMap baseMap}) {
    return ArcgisMapPlatform.instance.toggleBaseMap(mapId, baseMap);
  }

  Future<void> dispose() {
    return ArcgisMapPlatform.instance.dispose(mapId: mapId);
  }

  List<Graphic> getGraphicsInView() {
    return ArcgisMapPlatform.instance.getGraphicsInView(mapId);
  }

  Stream<bool> isGraphicHoveredStream() {
    return ArcgisMapPlatform.instance.isGraphicHoveredStream(mapId);
  }

  List<String> getVisibleGraphicIds() {
    return ArcgisMapPlatform.instance.getVisibleGraphicIds(mapId);
  }

  Future<void> setLocationDisplay(ArcgisLocationDisplay locationDisplay) {
    return ArcgisMapPlatform.instance
        .setLocationDisplay(mapId, locationDisplay.type)
        .whenComplete(
      () {
        _locationDisplay.deattachFromMap();
        _locationDisplay = locationDisplay..attachToMap(mapId);
      },
    );
  }

  Future<void> updateIsAttributionTextVisible(bool isAttributionTextVisible) {
    return ArcgisMapPlatform.instance
        .updateIsAttributionTextVisible(mapId, isAttributionTextVisible);
  }
}
