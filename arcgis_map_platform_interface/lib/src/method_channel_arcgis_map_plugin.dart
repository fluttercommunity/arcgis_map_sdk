import 'dart:async';
import 'dart:convert';

import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

class MethodChannelArcgisMapPlugin extends ArcgisMapPlatform {
  static const viewType = '<native_map_view>';

  Stream<double>? _zoomEventStream;
  final _methodCallStreamController = StreamController<MethodCall>.broadcast();

  static const _methodChannel = MethodChannel("esri.arcgis.flutter_plugin");

  MethodChannel _viewMethodChannelBuilder(int viewId) =>
      MethodChannel("esri.arcgis.flutter_plugin/$viewId");

  /// This method is called when the plugin is first initialized.
  @override
  Future<void> init(int mapId) async {
    _methodChannel.setMethodCallHandler(
      (call) async => _methodCallStreamController.add(call),
    );
  }

  @override
  void dispose({required int mapId}) {
    _methodCallStreamController.close();
  }

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
  Future<void> setInteraction(int mapId, {required bool isEnabled}) {
    return _viewMethodChannelBuilder(mapId)
        .invokeMethod("set_interaction", {"enabled": isEnabled});
  }

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
    return await _viewMethodChannelBuilder(mapId).invokeMethod(
      "move_camera",
      {
        "point": point.toMap(),
        "zoomLevel": zoomLevel,
        "animationOptions": animationOptions?.toMap(),
      },
    ) as bool;
  }

  @override
  Future<bool> zoomIn(int lodFactor, int mapId) async {
    return await _viewMethodChannelBuilder(mapId)
        .invokeMethod("zoom_in", {"lodFactor": lodFactor}) as bool;
  }

  @override
  Future<bool> zoomOut(int lodFactor, int mapId) async {
    return await _viewMethodChannelBuilder(mapId)
        .invokeMethod("zoom_out", {"lodFactor": lodFactor}) as bool;
  }

  @override
  Stream<double> getZoom(int mapId) {
    _zoomEventStream ??= EventChannel("esri.arcgis.flutter_plugin/$mapId/zoom")
        .receiveBroadcastStream()
        .map((event) => (event as int).toDouble());
    return _zoomEventStream!;
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
    _viewMethodChannelBuilder(mapId)
        .invokeMethod("add_view_padding", padding.toMap());
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

  @override
  Future<Envelope> getVisibleAreaExtent(int mapId) async {
    final result = await _viewMethodChannelBuilder(mapId)
        .invokeMethod("get_visible_area_extent") as String;
    return Envelope.fromMap(json.decode(result) as Map<String, dynamic>);
  }

  @override
  Future<void> createExportVectorTilesTask({
    required ExportVectorTilesTask task,
  }) async {
    await _methodChannel.invokeMethod(
      'create_export_vector_tiles_task',
      task.toMap(),
    );
  }

  @override
  Future<void> startExportVectorTilesTaskJob({
    required String taskId,
    required ExportVectorTilesParameters parameters,
    required String vectorTileCachePath,
    required Function(double progress)? onProgressChange,
  }) async {
    final listener = _methodCallStreamController.stream.listen((event) {
      if (event.method == "export_vector_tiles_job_progress" &&
          event.arguments["taskId"] == taskId) {
        final progress = event.arguments["progress"] as double;
        onProgressChange?.call(progress);
      }
    });
    await _methodChannel.invokeMethod(
      'start_export_vector_tiles_task_job',
      {
        'taskId': taskId,
        'exportVectorTilesParameters': parameters.toMap(),
        'vectorTileCachePath': vectorTileCachePath,
      },
    );
    listener.cancel();
  }

  @override
  Future<void> cancelExportVectorTileTaskJob({required String taskId}) {
    return _methodChannel.invokeMethod("cancel_export_vector_tiles_task_job", {
      'taskId': taskId,
    });
  }
}
