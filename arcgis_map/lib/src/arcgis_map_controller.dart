import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/services.dart';

class ArcgisMapController {
  ArcgisMapController._({
    required this.mapId,
  });

  final int mapId;

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
  }) async {
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

  Stream<double> getZoom() {
    return ArcgisMapPlatform.instance.getZoom(mapId);
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

  void onClick({required void Function(ArcGisMapAttributes?) onPressed}) {
    ArcgisMapPlatform.instance.onClick(onPressed, mapId);
  }

  void setMouseCursor(SystemMouseCursor cursor) {
    ArcgisMapPlatform.instance.setMouseCursor(cursor, mapId);
  }

  void updateGraphicSymbol(Symbol symbol, String polygonId) {
    ArcgisMapPlatform.instance.updateGraphicSymbol(symbol, polygonId, mapId);
  }

  Future<void> updateFeatureLayer({required List<Graphic> data}) {
    return ArcgisMapPlatform.instance.updateFeatureLayer(data, mapId);
  }

  bool destroyFeatureLayer({required String id}) {
    return ArcgisMapPlatform.instance
        .destroyFeatureLayer(layerId: id, mapId: mapId);
  }

  bool graphicContainsPoint({
    required String polygonId,
    required LatLng pointCoordinates,
  }) {
    return ArcgisMapPlatform.instance.graphicContainsPoint(
      polygonId: polygonId,
      pointCoordinates: pointCoordinates,
      mapId: mapId,
    );
  }

  Future<void> moveCamera({
    required LatLng point,
    int? zoomLevel,
    AnimationOptions? animationOptions,
  }) {
    return ArcgisMapPlatform.instance.moveCamera(
      mapId: mapId,
      point: point,
      zoomLevel: zoomLevel,
      animationOptions: animationOptions,
    );
  }

  Future<void> zoomIn({required int lodFactor}) {
    return ArcgisMapPlatform.instance.zoomIn(lodFactor, mapId);
  }

  Future<void> zoomOut({required int lodFactor}) {
    return ArcgisMapPlatform.instance.zoomOut(lodFactor, mapId);
  }

  void addGraphic(Graphic graphic) {
    ArcgisMapPlatform.instance.addGraphic(mapId, graphic);
  }

  void removeGraphic(String graphicId) {
    ArcgisMapPlatform.instance.removeGraphic(mapId, graphicId);
  }

  void addViewPadding({required ViewPadding padding}) {
    ArcgisMapPlatform.instance.addViewPadding(mapId, padding);
  }

  void toggleBaseMap({required BaseMap baseMap}) {
    ArcgisMapPlatform.instance.toggleBaseMap(mapId, baseMap);
  }

  void dispose() {
    ArcgisMapPlatform.instance.dispose(mapId: mapId);
  }

  List<Graphic> getGraphicsInView() {
    return ArcgisMapPlatform.instance.getGraphicsInView(mapId);
  }

  List<String> getVisibleGraphicIds() {
    return ArcgisMapPlatform.instance.getVisibleGraphicIds(mapId);
  }
}
