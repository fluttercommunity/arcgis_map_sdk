import 'dart:async';
import 'dart:html';
import 'dart:js';

import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:arcgis_map_web/src/arcgis_map_web_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';

class ArcgisMapWeb extends ArcgisMapPlatform {
  static final _hasScriptLoaded = Completer();

  static void registerWith(Registrar registrar) {
    ArcgisMapPlatform.instance = ArcgisMapWeb();

    //load webpack custom build of the ArcGIS JS API
    final script = ScriptElement()
      ..addEventListener("load", (event) => _hasScriptLoaded.complete())
      // ignore: unsafe_html
      ..src = "assets/packages/arcgis_map_web/assets/arcgis_js_api_custom_build/main.js";

    document.head!.append(script);

    final link = LinkElement()
      ..type = "text/css"
      ..href = "assets/packages/arcgis_map_web/assets/css_overrides/override_outline.css"
      ..rel = "stylesheet";

    document.head!.append(link);
  }

  final Map<int, ArcgisMapWebController> _mapById = {};

  ArcgisMapWebController _map(int mapId) {
    final controller = _mapById[mapId];
    if (controller == null) {
      throw StateError('Maps cannot be retrieved before calling buildView!');
    }
    return controller;
  }

  @override
  Future<void> init(int mapId) async {
    await _hasScriptLoaded.future;
    _map(mapId).init();
  }

  @override
  Future<void> moveCamera({
    required LatLng point,
    required int mapId,
    int? zoomLevel,
    AnimationOptions? animationOptions,
  }) {
    return _map(mapId).moveCamera(point: point, zoomLevel: zoomLevel, animationOptions: animationOptions);
  }

  @override
  Future<void> zoomIn(int lodFactor, int mapId) {
    return _map(mapId).zoomIn(lodFactor);
  }

  @override
  Future<void> zoomOut(int lodFactor, int mapId) {
    return _map(mapId).zoomOut(lodFactor);
  }

  @override
  void addGraphic(int mapId, Graphic graphic) {
    _map(mapId).addGraphic(graphic);
  }

  @override
  void removeGraphic(int mapId, String objectId) {
    _map(mapId).removeGraphic(objectId);
  }

  @override
  void addViewPadding(int mapId, ViewPadding padding) {
    return _map(mapId).addViewPadding(padding: padding);
  }

  @override
  void toggleBaseMap(int mapId, BaseMap baseMap) {
    return _map(mapId).toggleBaseMap(baseMap: baseMap);
  }

  @override
  List<Graphic> getGraphicsInView(int mapId) => _map(mapId).graphicsInView;

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
    return _map(mapId).addFeatureLayer(options, data, onPressed, url, getZoom, layerId);
  }

  @override
  void setMouseCursor(SystemMouseCursor cursor, int mapId) {
    _map(mapId).setMouseCursor(cursor);
  }

  @override
  void updateGraphicSymbol(Symbol symbol, String polygonId, int mapId) {
    _map(mapId).updateGraphicSymbol(symbol, polygonId);
  }

  @override
  Stream<double> getZoom(int mapId) {
    return _map(mapId).getZoom();
  }

  @override
  Stream<LatLng> centerPosition(int mapId) {
    return _map(mapId).centerPosition();
  }

  @override
  Stream<BoundingBox> getBounds(int mapId) {
    return _map(mapId).getBounds();
  }

  @override
  Stream<List<String>> visibleGraphics(int mapId) {
    return _map(mapId).visibleGraphics();
  }

  @override
  List<String> getVisibleGraphicIds(int mapId) {
    return _map(mapId).getVisibleGraphicIds();
  }

  @override
  Stream<String> attributionText(int mapId) {
    return _map(mapId).attributionText();
  }

  @override
  void onClick(void Function(ArcGisMapAttributes?) onPressed, int mapId) {
    _map(mapId).onClick(onPressed);
  }

  @override
  Future<void> updateFeatureLayer(List<Graphic> data, int mapId) async {
    await _map(mapId).updateFeatureLayer(data);
  }

  @override
  bool destroyFeatureLayer({required String layerId, required int mapId}) {
    return _map(mapId).destroyLayer(layerId);
  }

  @override
  bool graphicContainsPoint({required String polygonId, required LatLng pointCoordinates, required int mapId}) {
    return _map(mapId).graphicContainsPoint(polygonId, pointCoordinates);
  }

  @override
  void dispose({required int mapId}) {
    _map(mapId).dispose();
    _mapById.remove(mapId);
  }

  @override
  Widget buildView({
    required int creationId,
    required PlatformViewCreatedCallback onPlatformViewCreated,
    required ArcgisMapOptions mapOptions,
  }) {
    // Bail fast if we've already rendered this map ID...
    final widget = _mapById[creationId]?.widget;
    if (widget != null) {
      return widget;
    }

    final controller = StreamController<MapEvent>.broadcast();

    _hasScriptLoaded.future.then((_) {
      /// Since we manage assets locally, the following line is needed to direct to these assets:
      ///
      /// https://developers.arcgis.com/javascript/latest/es-modules/#managing-assets-locally
      context["esri"]["core"]["config"]["assetsPath"] =
          "/assets/packages/arcgis_map_web/assets/arcgis_js_api_custom_build/assets";
    });

    final mapController = ArcgisMapWebController(
      mapId: creationId,
      streamController: controller,
      mapOptions: mapOptions,
    );

    _mapById[creationId] = mapController;

    onPlatformViewCreated.call(creationId);

    return mapController.widget!;
  }
}
