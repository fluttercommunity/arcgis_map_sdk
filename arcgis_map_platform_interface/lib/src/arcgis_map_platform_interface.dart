import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:plugin_platform_interface/plugin_platform_interface.dart';

class ArcgisMapPlatform extends PlatformInterface {
  ArcgisMapPlatform() : super(token: _token);

  static late ArcgisMapPlatform _instance;

  static final Object _token = Object();

  static ArcgisMapPlatform get instance => _instance;

  static set instance(ArcgisMapPlatform instance) {
    PlatformInterface.verifyToken(instance, _token);
    _instance = instance;
  }

  /// This method is called when the plugin is first initialized.
  Future<void> init(int mapId) {
    throw UnimplementedError('init() has not been implemented.');
  }

  Future<FeatureLayer> addFeatureLayer(
    FeatureLayerOptions options,
    List<Graphic>? data,
    void Function(dynamic)? onPressed,
    String? url,
    int mapId,
    void Function(double)? getZoom,
    String layerId,
  ) async {
    throw UnimplementedError('addFeatureLayer() has not been implemented.');
  }

  Stream<double> getZoom(int mapId) {
    throw UnimplementedError('getZoom() has not been implemented');
  }

  void setMouseCursor(SystemMouseCursor cursor, int mapId) {
    throw UnimplementedError('setMouseCursor() has not been implemented');
  }

  void updateGraphicSymbol(Symbol symbol, String graphicId, int mapId) {
    throw UnimplementedError('updateGraphicSymbol() has not been implemented');
  }

  Stream<LatLng> centerPosition(int mapId) {
    throw UnimplementedError('centerPosition() has not been implemented');
  }

  Stream<List<String>> visibleGraphics(int mapId) {
    throw UnimplementedError('visibleGraphics() has not been implemented.');
  }

  Stream<BoundingBox> getBounds(int mapId) {
    throw UnimplementedError('getBounds() has not been implemented.');
  }

  Stream<String> attributionText(int mapId) {
    throw UnimplementedError('attributionText() has not been implemented.');
  }

  void onClick(void Function(ArcGisMapAttributes?) onPressed, int mapId) {
    throw UnimplementedError('onClick() has not been implemented.');
  }

  Future<void> updateFeatureLayer(List<Graphic> data, int mapId) async {
    throw UnimplementedError('addFeatureLayer() has not been implemented.');
  }

  bool destroyFeatureLayer({required String layerId, required int mapId}) {
    throw UnimplementedError('destroyFeatureLayer() has not been implemented.');
  }

  bool graphicContainsPoint({
    required String polygonId,
    required LatLng pointCoordinates,
    required int mapId,
  }) {
    throw UnimplementedError(
      'graphicContainsPoint() has not been implemented.',
    );
  }

  void dispose({required int mapId}) {
    throw UnimplementedError('dispose() has not been implemented.');
  }

  Widget buildView({
    required int creationId,
    required PlatformViewCreatedCallback onPlatformViewCreated,
    required ArcgisMapOptions mapOptions,
  }) {
    throw UnimplementedError('buildView() has not been implemented.');
  }

  Future<bool> moveCamera({
    required LatLng point,
    required int mapId,
    int? zoomLevel,
    AnimationOptions? animationOptions,
  }) {
    throw UnimplementedError('moveCamera() has not been implemented.');
  }

  Future<bool> zoomIn(int lodFactor, int mapId) {
    throw UnimplementedError('zoomIn() has not been implemented.');
  }

  Future<bool> zoomOut(int lodFactor, int mapId) {
    throw UnimplementedError('zoomOut() has not been implemented.');
  }

  Future<void> setInteraction(int mapId, {required bool isEnabled}) {
    throw UnimplementedError('addGraphic() has not been implemented.');
  }

  /// Adds the provided graphic to the map.
  /// You can't add a second graphic with the same id.
  Future<void> addGraphic(int mapId, Graphic graphic) {
    throw UnimplementedError('addGraphic() has not been implemented.');
  }

  Future<void> removeGraphic(int mapId, String graphicId) {
    throw UnimplementedError('removeGraphic() has not been implemented.');
  }

  void addViewPadding(int mapId, ViewPadding padding) {
    throw UnimplementedError('addViewPadding() has not been implemented.');
  }

  void toggleBaseMap(int mapId, BaseMap baseMap) {
    throw UnimplementedError('toggleBaseMap() has not been implemented.');
  }

  List<Graphic> getGraphicsInView(int mapId) {
    throw UnimplementedError('getGraphicsInView() has not been implemented.');
  }

  List<String> getVisibleGraphicIds(int mapId) {
    throw UnimplementedError(
      'getVisibleGraphicIds() has not been implemented.',
    );
  }
}
