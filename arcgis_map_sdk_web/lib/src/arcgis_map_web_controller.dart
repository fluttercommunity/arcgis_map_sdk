import 'dart:async';
import 'dart:js_interop';
import 'dart:ui' as ui;

import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';
import 'package:arcgis_map_sdk_web/arcgis_map_web_js.dart';
import 'package:arcgis_map_sdk_web/src/components/esri_map.dart';
import 'package:arcgis_map_sdk_web/src/components/map_view.dart';
import 'package:arcgis_map_sdk_web/src/components/scene_view.dart';
import 'package:arcgis_map_sdk_web/src/layer_controller.dart';
import 'package:arcgis_map_sdk_web/src/model_extension.dart';
import 'package:async/async.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:js/js_util.dart';
import 'package:web/web.dart';

class ArcgisMapWebController {
  final int _mapId;
  final ArcgisMapOptions _mapOptions;
  final Completer<bool> _baseMapLoaded = Completer();
  ViewPadding? _activePadding;

  late JsEsriMap? _map = const EsriMap().init(
    basemap: _mapOptions.basemap?.value,
    ground: _mapOptions.mapStyle == MapStyle.threeD
        ? _mapOptions.ground?.value
        : null,
    vectorTileLayerUrls: _mapOptions.vectorTilesUrls,
  );

  late LayerController? _layerController = LayerController(
    minZoom: _mapOptions.minZoom,
    maxZoom: _mapOptions.maxZoom,
  );

  late final _div = HTMLDivElement()
    ..id = _getViewType(_mapId)
    ..style.width = '100%'
    ..style.height = '100%';

  /// Can be either a SceneView (3D) or a MapView (2D)
  JsView? _activeView;

  // ignore: use_late_for_private_fields_and_variables
  JsSceneView? _sceneView;

  // ignore: use_late_for_private_fields_and_variables
  JsMapView? _mapView;
  HtmlElementView? _widget;
  JsHandle? _preventInteractionHandle;
  JsHandle? _pointerMoveHandle;

  String _getViewType(int mapId) => 'plugins.flutter.io/arcgis_$mapId';

  /// The Flutter widget that will contain the rendered Map. Used for caching.
  Widget? get widget {
    if (_widget == null && !_streamController.isClosed) {
      _widget = HtmlElementView(
        viewType: _getViewType(_mapId),
      );
    }
    return _widget;
  }

  /// The StreamController used by this controller and the geometry ones.
  final StreamController<MapEvent> _streamController;

  /// The Stream over which this controller broadcasts events.
  Stream<MapEvent> get events => _streamController.stream;

  ArcgisMapWebController({
    required int mapId,
    //TODO: Implement Stream Controller
    required StreamController<MapEvent> streamController,
    required ArcgisMapOptions mapOptions,
  })  : _mapId = mapId,
        _streamController = streamController,
        _mapOptions = mapOptions {
    // ignore: avoid_dynamic_calls
    ui.platformViewRegistry.registerViewFactory(
      _getViewType(_mapId),
      (int viewId) => _div,
    );
  }

  void init() {
    _createMap();
  }

  Future<void> _createMap() async {
    final esri = getProperty<Object>(globalThis, 'esri');
    final core = getProperty<Object>(esri, 'core');
    final config = getProperty<Object>(core, 'config');
    setProperty(config, 'apiKey', _mapOptions.apiKey);

    if (_mapOptions.mapStyle == MapStyle.threeD) {
      _sceneView = _createJsSceneView();
      _sceneView!.container = _div;
      _activeView = _sceneView! as JsView;
    } else {
      _mapView = _createJsMapView();
      _mapView!.container = _div;
      _activeView = _mapView! as JsView;
    }

    // Notifies the controller that the map is ready to be used and [moveBaseMapLabelsToBackground]
    // can be called.
    _map!.basemap.watch(
      'loaded',
      allowInterop((loaded, _, __, ___) {
        _baseMapLoaded.complete(loaded as bool);
      }),
    );

    _createDefaultViews(_activeView!);

    if (_mapOptions.showLabelsBeneathGraphics) {
      await _baseMapLoaded.future;
      _layerController!.moveBaseMapLabelsToBackground(
        map: _map!,
        baseMap: _map!.basemap,
        apiKey: _mapOptions.apiKey,
      );
    }

    if (!_mapOptions.isInteractive) {
      _preventInteractionHandle =
          _layerController!.preventInteraction(_activeView!);
    }

    _pointerMoveHandle = _layerController!
        .registerGlobalPointerMoveEventHandler(_map!, _activeView!);

    _layerController!.initializeStreams();
  }

  /// Creates the default views e.g. zoom, compass, etc.
  void _createDefaultViews(JsView view) {
    if (!_mapOptions.isPopupEnabled) {
      view.popup = null;
    }

    // remove all default views
    final oldUi = view.ui.components;
    for (final ui in oldUi) {
      view.ui.remove(ui);
    }

    // Add specific views
    final newUiList = _mapOptions.defaultUiList;
    for (final ui in newUiList) {
      view.ui.add(ui.viewType.value, ui.position.value);
    }
  }

  void dispose() {
    _preventInteractionHandle?.remove();
    _pointerMoveHandle?.remove();
    _widget = null;
    _map = null;
    _activeView = null;
    _layerController = null;
    _streamController.close();
  }

  Future<FeatureLayer> addFeatureLayer(
    FeatureLayerOptions options,
    List<Graphic>? data,
    void Function(dynamic)? onPressed,
    String? url,
    void Function(double)? getZoom,
    String layerId,
  ) async {
    if (getProperty(globalThis, "FeatureLayer") == null) {
      await promiseToFuture(loadFeatureLayer());
    }
    return _layerController!.createFeatureLayer(
      options,
      data,
      onPressed,
      url,
      layerId,
      _map!,
      _activeView!,
    );
  }

  Future<SceneLayer> addSceneLayer({
    required SceneLayerOptions options,
    required String layerId,
    required String url,
  }) {
    final scene = _layerController!.createSceneLayer(
      options: options,
      layerId: layerId,
      url: url,
      map: _map!,
    );

    /// Remove 3D layers temporarily if 2D Map is selected
    if (_mapOptions.mapStyle == MapStyle.twoD) {
      _layerController!.remove3dLayers(map: _map!);
    }

    return scene;
  }

  Future<GraphicsLayer> addGraphicsLayer(
    GraphicsLayerOptions options,
    String layerId,
    void Function(dynamic)? onPressed,
  ) {
    return _layerController!.createGraphicsLayer(
      options,
      layerId,
      _map!,
      _activeView!,
      onPressed,
    );
  }

  Stream<Attributes?> onClickListener() {
    return _layerController!.getOnClickListener(_activeView!);
  }

  void setMouseCursor(SystemMouseCursor cursor) {
    return _layerController!.setMouseCursor(_getViewType(_mapId), cursor);
  }

  void updateGraphicSymbol({
    required String layerId,
    required String graphicId,
    required Symbol symbol,
  }) {
    return _layerController!.updateGraphicSymbol(
      map: _map!,
      layerId: layerId,
      symbol: symbol,
      graphicId: graphicId,
    );
  }

  Stream<double> getZoom() {
    return _layerController!.getZoom(_activeView!);
  }

  /// TODO Also call this method on hot restart

  /// This method is called when the view switches between 2d and 3d. It will destroy the webgl context and
  /// reinitialize the map. This way, the persistent error of too many webgl contexts is avoided.
  void _destroyWebglContext() {
    final canvasElement = window.document.querySelector(
      '#plugins\\.flutter\\.io\\/arcgis_$_mapId > div > div > canvas',
    );
    // "webgl" (or "experimental-webgl") which will create a WebGLRenderingContext object representing a
    // three-dimensional rendering context. This context is only available on browsers that implement WebGL version 1 (OpenGL ES 2.0).
    final webgl = (canvasElement as HTMLCanvasElement?)?.getContext('webgl');
    // "webgl2" which will create a WebGL2RenderingContext object representing a three-dimensional rendering context.
    // This context is only available on browsers that implement WebGL version 2 (OpenGL ES 3.0)
    final webgl2 = canvasElement?.getContext('webgl2');

    if (webgl != null) {
      (webgl as WebGLRenderingContext)
          .getCustomExtension('WEBGL_lose_context')
          ?.loseContext();
      webgl.getCustomExtension('WEBGL_lose_context')?.restoreContext();
    }

    if (webgl2 != null) {
      (webgl2 as WebGLRenderingContext)
          .getCustomExtension('WEBGL_lose_context')
          ?.loseContext();
      webgl2.getCustomExtension('WEBGL_lose_context')?.restoreContext();
    }
  }

  JsSceneView _createJsSceneView() {
    return SceneView().init(
      map: _map,
      position: <double>[
        _mapOptions.initialCenter.longitude,
        _mapOptions.initialCenter.latitude,
      ],
      zoom: _mapOptions.zoom,
      tilt: _mapOptions.tilt,
      padding: _activePadding ?? _mapOptions.padding,
      rotationEnabled: _mapOptions.rotationEnabled,
      minZoom: _mapOptions.minZoom,
      maxZoom: _mapOptions.maxZoom,
      xMin: _mapOptions.xMin,
      xMax: _mapOptions.xMax,
      yMin: _mapOptions.yMin,
      yMax: _mapOptions.yMax,
      heading: _mapOptions.heading,
    );
  }

  JsMapView _createJsMapView() {
    return MapView().init(
      map: _map,
      center: [
        _mapOptions.initialCenter.longitude,
        _mapOptions.initialCenter.latitude,
      ],
      zoom: _mapOptions.zoom,
      padding: _activePadding ?? _mapOptions.padding,
      rotationEnabled: _mapOptions.rotationEnabled,
      minZoom: _mapOptions.minZoom,
      maxZoom: _mapOptions.maxZoom,
      xMin: _mapOptions.xMin,
      xMax: _mapOptions.xMax,
      yMin: _mapOptions.yMin,
      yMax: _mapOptions.yMax,
    );
  }

  /// Switches the map style between 2D and 3D and removes not supported layers if necessary.
  void switchMapStyle(MapStyle mapStyle) {
    if (mapStyle == MapStyle.threeD) {
      _layerController!.setGroundElevation(map: _map!, enable: true);
      _destroyWebglContext();
      _sceneView = _createJsSceneView();
      _sceneView!.viewpoint = _mapView!.viewpoint;
      _sceneView!.container = _div;
      _activeView = _sceneView! as JsView;
      _createDefaultViews(_activeView!);
      _connectStreamsToNewActiveView();
      _layerController!.add3dLayers(map: _map!);
    } else {
      _destroyWebglContext();
      _mapView = _createJsMapView();
      _layerController!.remove3dLayers(map: _map!);
      _mapView!.viewpoint = _sceneView!.viewpoint;

      _mapView!.container = _div;
      _activeView = _mapView! as JsView;
      _createDefaultViews(_activeView!);
      _connectStreamsToNewActiveView();
    }

    _pointerMoveHandle = _layerController!
        .registerGlobalPointerMoveEventHandler(_map!, _activeView!);
  }

  void _connectStreamsToNewActiveView() {
    _layerController!.streamsRefreshed.clear();
    for (final StreamGroup streamGroup in _layerController!.allStreamGroups) {
      if (!streamGroup.isIdle) {
        if (streamGroup is StreamGroup<BoundingBox>) {
          _layerController!.refreshBoundsStreams(_activeView!);
        } else if (streamGroup is StreamGroup<String>) {
          _layerController!.refreshAttributionStreams(_activeView!);
        } else if (streamGroup is StreamGroup<Attributes?>) {
          _layerController!.refreshOnClickStreams(_activeView!);
        } else if (streamGroup is StreamGroup<List<String>>) {
          _layerController!.refreshVisibleGraphicsStreams(_activeView!, _map!);
        } else if (streamGroup is StreamGroup<LatLng>) {
          _layerController!.refreshCenterPositionStreams(_activeView!);
        } else if (streamGroup is StreamGroup<double>) {
          _layerController!.refreshZoomStreams(_activeView!);
        }
      }
    }
  }

  Stream<LatLng> centerPosition() {
    return _layerController!.getCenterPosition(_activeView!);
  }

  Stream<BoundingBox> getBounds() {
    return _layerController!.getBoundsStream(_activeView!);
  }

  Stream<List<String>> visibleGraphics() {
    return _layerController!.getVisibleGraphicsStream(_activeView!, _map!);
  }

  List<String> getVisibleGraphicIds() {
    return _layerController!.getVisibleGraphicIds(_activeView!, _map!);
  }

  Stream<String> attributionText() {
    return _layerController!.getAttributionStream(_activeView!);
  }

  Future<void> updateFeatureLayer({
    required String featureLayerId,
    required List<Graphic> data,
  }) async {
    await _layerController!.updateFeatureLayer(
      map: _map!,
      featureLayerId: featureLayerId,
      data: data,
    );
  }

  bool destroyLayer(String layerId) {
    return _layerController!.destroyLayer(
      map: _map!,
      layerId: layerId,
    );
  }

  bool polygonContainsPoint(String polygonId, LatLng pointCoordinates) {
    return _layerController!.polygonContainsPoint(
      view: _activeView!,
      map: _map!,
      polygonId: polygonId,
      pointCoordinates: pointCoordinates,
    );
  }

  Future<void> moveCameraToPoints({
    required List<LatLng> points,
    double? padding,
  }) async {
    await _layerController!.moveCameraToPoints(
      points: points,
      padding: padding,
      view: _activeView!,
    );
  }

  Future<void> moveCamera({
    required LatLng point,
    double? zoomLevel,
    int? threeDHeading,
    int? threeDTilt,
    AnimationOptions? animationOptions,
  }) async {
    await _layerController!.moveCamera(
      point: point,
      zoomLevel: zoomLevel,
      view: _activeView!,
      animationOptions: animationOptions,
    );
    return;
  }

  Future<bool> zoomIn({
    required int lodFactor,
    AnimationOptions? animationOptions,
  }) {
    return _layerController!.zoomIn(
      lodFactor: lodFactor,
      view: _activeView!,
      animationOptions: animationOptions,
    );
  }

  Future<bool> zoomOut({
    required int lodFactor,
    AnimationOptions? animationOptions,
  }) {
    return _layerController!.zoomOut(
      lodFactor: lodFactor,
      view: _activeView!,
      animationOptions: animationOptions,
    );
  }

  Future<void> addGraphic(String featureLayerId, Graphic graphic) {
    return _layerController!.addGraphic(_map!, featureLayerId, graphic);
  }

  Future<void> removeGraphic(String layerId, String graphicId) {
    return _layerController!.removeGraphic(_map!, layerId, graphicId);
  }

  void removeGraphics({
    String? layerId,
    String? removeByAttributeKey,
    String? removeByAttributeValue,
    String? excludeAttributeKey,
    List<String>? excludeAttributeValues,
  }) {
    _layerController!.removeGraphics(
      map: _map!,
      layerId: layerId,
      removeByAttributeKey: removeByAttributeKey,
      removeByAttributeValue: removeByAttributeValue,
      excludeAttributeKey: excludeAttributeKey,
      excludeAttributeValues: excludeAttributeValues,
    );
  }

  /// TODO fully check its behaviour in SceneView
  void addViewPadding({required ViewPadding padding}) {
    _layerController!.addViewPadding(view: _activeView!, padding: padding);
    if (_activePadding == null) {
      _activePadding = padding;
      return;
    } else {
      _activePadding = _activePadding!.copyWith(
        top: _activePadding!.top + padding.top,
        right: _activePadding!.right + padding.right,
        bottom: _activePadding!.bottom + padding.bottom,
        left: _activePadding!.left + padding.left,
      );
    }
  }

  Future<void> toggleBaseMap({required BaseMap baseMap}) async {
    await _layerController!.toggleBaseMap(
      view: _activeView!,
      baseMap: baseMap,
      map: _map!,
      apiKey: _mapOptions.apiKey,
      showLabelsBeneathGraphics: _mapOptions.showLabelsBeneathGraphics,
    );
  }

  List<Graphic> get graphicsInView => _layerController!.graphicsInView;

  Stream<bool> get isGraphicHoveredStream =>
      _layerController!.isGraphicHoveredStreamController.stream;
}
