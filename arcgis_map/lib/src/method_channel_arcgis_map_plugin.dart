import 'dart:io';

import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

class MethodChannelArcgisMapPlugin implements ArcgisMapPlatform {
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
  void updateGraphicSymbol(Symbol symbol, String polygonId, int mapId) {
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
  void dispose({required int mapId}) {}

  @override
  Widget buildView({
    required int creationId,
    required PlatformViewCreatedCallback onPlatformViewCreated,
    required ArcgisMapOptions mapOptions,
  }) {
    if (Platform.isAndroid) {
      return AndroidView(
        viewType: 'native_arcgis_map_$creationId',
        creationParams: mapOptions.toMap(),
        // TODO(Tapped): Add either Directionality.of(context) or make it adjustable
        layoutDirection: TextDirection.ltr,
        creationParamsCodec: const StandardMessageCodec(),
      );
    }

    if (Platform.isIOS) {
      return UiKitView(
        viewType: 'native_arcgis_map_$creationId',
        creationParams: mapOptions.toMap(),
        // TODO(Tapped): Add either Directionality.of(context) or make it adjustable
        layoutDirection: TextDirection.ltr,
        creationParamsCodec: const StandardMessageCodec(),
      );
    }

    throw UnimplementedError(
      'Unimplemented platform ${Platform.operatingSystem}',
    );
  }

  @override
  Future<void> moveCamera({
    required LatLng point,
    required int mapId,
    int? zoomLevel,
    AnimationOptions? animationOptions,
  }) {
    throw UnimplementedError('moveCamera() has not been implemented.');
  }

  @override
  Future<void> zoomIn(int lodFactor, int mapId) {
    return _methodChannelBuilder(mapId).invokeMethod(
      "zoom_in",
      {
        "lodFactor": lodFactor,
      },
    );
  }

  @override
  Future<void> zoomOut(int lodFactor, int mapId) {
    return _methodChannelBuilder(mapId).invokeMethod(
      "zoom_out",
      {
        "lodFactor": lodFactor,
      },
    );
  }

  @override
  Stream<double> getZoom(int mapId) {
    throw UnimplementedError('addGraphic() has not been implemented.');
  }

  @override
  void addGraphic(int mapId, Graphic graphic) {
    throw UnimplementedError('addGraphic() has not been implemented.');
  }

  @override
  void removeGraphic(int mapId, String graphicId) {
    throw UnimplementedError('removeGraphic() has not been implemented.');
  }

  @override
  void addViewPadding(int mapId, ViewPadding padding) {
    throw UnimplementedError('addViewPadding() has not been implemented.');
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
