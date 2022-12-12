import 'package:arcgis_map_method_channel/src/model_extension.dart';
import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

class MethodChannelArcgisMapPlugin extends ArcgisMapPlatform {
  static const viewType = '<native_map_view>';

  Stream<double>? _zoomEventStream;

  MethodChannel _methodChannelBuilder(int viewId) =>
      MethodChannel("esri.arcgis.flutter_plugin/$viewId");

  /// This method is called when the plugin is first initialized.
  @override
  Future<void> init(int mapId) async {}

  @override
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

  @override
  void setMouseCursor(SystemMouseCursor cursor, int mapId) {
    throw UnimplementedError('setMouseCursor() has not been implemented');
  }

  @override
  void updateGraphicSymbol(Symbol symbol, String graphicId, int mapId) {
    throw UnimplementedError('updateGraphicSymbol() has not been implemented');
  }

  @override
  Stream<LatLng> centerPosition(int mapId) {
    throw UnimplementedError('centerPosition() has not been implemented');
  }

  @override
  Stream<List<String>> visibleGraphics(int mapId) {
    throw UnimplementedError('visibleGraphics() has not been implemented.');
  }

  @override
  Stream<BoundingBox> getBounds(int mapId) {
    throw UnimplementedError('getBounds() has not been implemented.');
  }

  @override
  Stream<String> attributionText(int mapId) {
    throw UnimplementedError('attributionText() has not been implemented.');
  }

  @override
  void onClick(void Function(ArcGisMapAttributes?) onPressed, int mapId) {
    throw UnimplementedError('onClick() has not been implemented.');
  }

  @override
  Future<void> updateFeatureLayer(List<Graphic> data, int mapId) async {
    throw UnimplementedError('addFeatureLayer() has not been implemented.');
  }

  @override
  bool destroyFeatureLayer({required String layerId, required int mapId}) {
    throw UnimplementedError('destroyFeatureLayer() has not been implemented.');
  }

  @override
  bool graphicContainsPoint({
    required String polygonId,
    required LatLng pointCoordinates,
    required int mapId,
  }) {
    throw UnimplementedError(
      'graphicContainsPoint() has not been implemented.',
    );
  }

  @override
  Future<void> setInteraction(int mapId, {required bool isEnabled}) {
    return _methodChannelBuilder(mapId)
        .invokeMethod("set_interaction", {"enabled": isEnabled});
  }

  @override
  void dispose({required int mapId}) {}

  @override
  Widget buildView({
    required int creationId,
    required PlatformViewCreatedCallback onPlatformViewCreated,
    required ArcgisMapOptions mapOptions,
  });

  @override
  Future<bool> moveCamera({
    required LatLng point,
    required int mapId,
    int? zoomLevel,
    AnimationOptions? animationOptions,
  }) async {
    return _methodChannelBuilder(mapId).invokeMethod<bool>(
      "move_camera",
      {
        "point": point.toMap(),
        "zoomLevel": zoomLevel,
        "animationOptions": animationOptions?.toMap(),
      },
    ).then((value) => value!);
  }

  @override
  Future<bool> zoomIn(int lodFactor, int mapId) async {
    return _methodChannelBuilder(mapId).invokeMethod<bool>(
      "zoom_in",
      {"lodFactor": lodFactor},
    ).then((value) => value!);
  }

  @override
  Future<bool> zoomOut(int lodFactor, int mapId) async {
    return _methodChannelBuilder(mapId).invokeMethod<bool>(
      "zoom_out",
      {"lodFactor": lodFactor},
    ).then((value) => value!);
  }

  @override
  Stream<double> getZoom(int mapId) {
    _zoomEventStream ??= EventChannel("esri.arcgis.flutter_plugin/$mapId/zoom")
        .receiveBroadcastStream()
        .cast<int>()
        .map((event) => event.toDouble());
    return _zoomEventStream!;
  }

  @override
  Future<void> addGraphic(int mapId, Graphic graphic) {
    return _methodChannelBuilder(mapId).invokeMethod(
      "add_graphic",
      graphic.toJson(),
    );
  }

  @override
  Future<void> removeGraphic(int mapId, String graphicId) {
    return _methodChannelBuilder(mapId)
        .invokeMethod("remove_graphic", graphicId);
  }

  @override
  void addViewPadding(int mapId, ViewPadding padding) {
    _methodChannelBuilder(mapId)
        .invokeMethod<void>("add_view_padding", padding.toMap());
  }

  @override
  void toggleBaseMap(int mapId, BaseMap baseMap) {
    throw UnimplementedError('toggleBaseMap() has not been implemented.');
  }

  @override
  List<Graphic> getGraphicsInView(int mapId) {
    throw UnimplementedError('getGraphicsInView() has not been implemented.');
  }

  @override
  List<String> getVisibleGraphicIds(int mapId) {
    throw UnimplementedError(
      'getVisibleGraphicIds() has not been implemented.',
    );
  }
}
