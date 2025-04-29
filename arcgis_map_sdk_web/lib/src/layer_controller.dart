import 'dart:async';

import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';
import 'package:arcgis_map_sdk_web/arcgis_map_web_js.dart';
import 'package:arcgis_map_sdk_web/src/components/attribution.dart';
import 'package:arcgis_map_sdk_web/src/components/js_helper_functions.dart';
import 'package:arcgis_map_sdk_web/src/components/vector_layer.dart';
import 'package:arcgis_map_sdk_web/src/model_extension.dart';
import 'package:async/async.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:js/js_util.dart';
import 'package:web/web.dart';

enum HoveredState { hovered, notHovered }

class LayerController {
  LayerController({required this.minZoom, required this.maxZoom});

  final int minZoom;
  final int maxZoom;

  final List<JsLayer> _layers = <JsLayer>[];
  final List<JsLayer> _temp3DLayers = [];
  final List<String> _graphicObjectIds = <String>[];

  /// Used as a buffer. This layer is destroyed and recreated, so that the labels it contains can be moved
  /// below all other layers.
  JsVectorTileLayer? _recreatedLabelsLayer;

  /// Adds a stream to return true when the mouse cursor hovers over at least one Graphic in any layer.
  /// This makes the change of the mouse cursor on hover much more reliable.
  final StreamController<bool> isGraphicHoveredStreamController =
      StreamController();

  /// Map of [Graphic] and its [HoveredState] in the map view.
  /// Needed for the [registerGlobalPointerMoveEventHandler]
  ///
  /// With the use of hovered state, continuous callbacks are avoided for [Graphic.onEnter]
  /// and [Graphic.onExit].
  final Map<Graphic, HoveredState> _graphics = {};

  /// Get the [Graphic] in the map view
  List<Graphic> get graphicsInView => _graphics.keys.toList();

  final StreamGroup<BoundingBox> boundsStreamGroup = StreamGroup.broadcast();
  final StreamGroup<String> attributionTextStreamGroup =
      StreamGroup.broadcast();
  final StreamGroup<Attributes?> onClickStreamGroup = StreamGroup.broadcast();
  final StreamGroup<double> zoomStreamGroup = StreamGroup.broadcast();
  final StreamGroup<LatLng> centerPositionStreamGroup = StreamGroup.broadcast();
  final StreamGroup<List<String>> visibleGraphicsStreamGroup =
      StreamGroup.broadcast();
  final List<StreamGroup> allStreamGroups = [];

  List<String> streamsRefreshed = [];

  void initializeStreams() {
    allStreamGroups.add(boundsStreamGroup);
    allStreamGroups.add(attributionTextStreamGroup);
    allStreamGroups.add(zoomStreamGroup);
    allStreamGroups.add(onClickStreamGroup);
    allStreamGroups.add(centerPositionStreamGroup);
    allStreamGroups.add(visibleGraphicsStreamGroup);
  }

  Future<SceneLayer> createSceneLayer({
    required SceneLayerOptions options,
    required String layerId,
    required String? url,
    required JsEsriMap map,
  }) async {
    final JsSceneLayer sceneLayer;
    // Create a layer from a backend service
    if (url != null) {
      sceneLayer = JsSceneLayer(
        jsify({
          'id': layerId,
          "url": url,
          "renderer": {
            "type": "simple",
            "symbol": options.symbol.toJson(),
          },
          "elevationInfo": {
            "mode": options.elevationMode.value,
            "offset": 0,
            'expression': '0',
            'unit': "meters",
          },
        }),
      );
    } else {
      throw Exception("No url provided");
    }

    // Add layer to map, not a promise
    map.add(sceneLayer);

    _layers.add(sceneLayer as JsLayer);

    final SceneLayer sceneLayer0 = SceneLayer(id: sceneLayer.id);

    return sceneLayer0;
  }

  Future<FeatureLayer> createFeatureLayer(
    FeatureLayerOptions options,
    List<Graphic>? data,
    void Function(dynamic)? onPressed,
    String? url,
    String layerId,
    JsEsriMap map,
    JsView view,
  ) async {
    final JsFeatureLayer featureLayer;
    // Create a layer from a backend service
    if (url != null) {
      featureLayer = JsFeatureLayer(
        jsify({"url": url}),
      );
    } else {
      // Checks if a feature layer with the layerId is already in use
      if (!_layers
          .map((featureLayer) => featureLayer.id)
          .toList(growable: false)
          .contains(layerId)) {
        featureLayer = JsFeatureLayer(
          jsify({
            'id': layerId,
            "source": data?.map((Graphic graphic) => graphic.toJson()),
            "title": 'First layer',
            // Includes all fields from the service in the layer
            "fields": options.fields.map((Field field) => field.toJson()),
            "renderer": {
              "type": "simple",
              "symbol": options.symbol.toJson(),
            },
            "outFields": ["*"],
            // "featureReduction": options.featureReduction,
          }),
        );
      } else {
        throw Exception(
          'A feature layer with the $layerId is already in use'
          '\nPlease set another id to your layer',
        );
      }
    }

    // Add layer to map, not a promise
    map.add(featureLayer);

    // Set onClick Listener
    if (onPressed != null) {
      view.on(
        ['click'],
        allowInterop((event) async {
          final JsHitTestResult hitTestResult =
              await view.hitTest(event).toFuture();
          if (hitTestResult.results?.isNotEmpty ?? false) {
            final graphicAttributes =
                hitTestResult.results![0].graphic?.attributes;
            onPressed(Attributes(jsNativeObjectToMap(graphicAttributes)));
          }
        }),
      );
    }

    _layers.add(featureLayer as JsLayer);

    return FeatureLayer(id: featureLayer.id);
  }

  Future<GraphicsLayer> createGraphicsLayer(
    GraphicsLayerOptions options,
    String layerId,
    JsEsriMap map,
    JsView view,
    void Function(dynamic)? onPressed,
  ) async {
    final JsGraphicsLayer graphicsLayer;
    // Checks if a layer with the layerId is already in use
    if (!_layers
        .map((graphicsLayer) => graphicsLayer.id)
        .toList(growable: false)
        .contains(layerId)) {
      graphicsLayer = JsGraphicsLayer(
        jsify({
          'id': layerId,
          "title": 'GraphicLayer',
          "elevationInfo": {
            "mode": options.elevationMode.value,
            "offset": 0,
            'expression': 0,
            'unit': "meters",
          },
          "outFields": ["*"],
        }),
      );
    } else {
      throw Exception(
        'A feature layer with the $layerId is already in use'
        '\nPlease set another id to your layer',
      );
    }

    _layers.add(graphicsLayer as JsLayer);

    // Add layer to map, not a promise
    map.add(graphicsLayer);

    // Set onClick Listener
    if (onPressed != null) {
      view.on(
        ['click'],
        allowInterop((event) async {
          final JsHitTestResult hitTestResult =
              await view.hitTest(event).toFuture();
          if (hitTestResult.results?.isNotEmpty ?? false) {
            final graphicAttributes =
                hitTestResult.results![0].graphic?.attributes;
            onPressed(Attributes(jsNativeObjectToMap(graphicAttributes)));
          }
        }),
      );
    }

    return GraphicsLayer(id: layerId);
  }

  /// Check if the polygon with the [polygonId] contains the point with the
  /// [pointCoordinates]
  bool polygonContainsPoint({
    required JsView view,
    required JsEsriMap map,
    required String polygonId,
    required LatLng pointCoordinates,
  }) {
    // Search for the polygon in the map view
    final JsGraphic? polygonInView = view.graphics.find(
      allowInterop((JsGraphic graphic, _, __) {
        final result = graphic.attributes.id;
        return result == polygonId;
      }),
    );

    if (polygonInView != null) {
      return _isPointInPolygon(polygonInView, pointCoordinates);
    }

    // Search for the polygon in the graphic layers
    JsGraphic? polygonInLayer;
    final layers = map.layers;
    layers?.forEach(
      allowInterop((layer, _, __) {
        if (layer is JsGraphicsLayer) {
          final JsGraphic? graphic = layer.graphics?.find(
            allowInterop((JsGraphic graphic, _, __) {
              final result = graphic.attributes.id;
              return result == polygonId;
            }),
          );
          if (graphic != null) {
            polygonInLayer = graphic;
          }
        }
      }),
    );

    if (polygonInLayer != null) {
      return _isPointInPolygon(polygonInLayer!, pointCoordinates);
    } else {
      return false;
    }
  }

  bool _isPointInPolygon(JsGraphic polygon, LatLng pointCoordinates) {
    return polygon.geometry.extent.contains(
      JsPoint(
        jsify({
          'latitude': pointCoordinates.latitude,
          'longitude': pointCoordinates.longitude,
        }),
      ),
    );
  }

  static const onClickStreamRefreshedForCurrentView =
      'onClickStreamRefreshedForCurrentView';

  /// Returns a Stream with Attributes of the clicked object.
  /// If nothing is selected, the Stream returns null.
  Stream<Attributes?> getOnClickListener(JsView view) {
    if (!streamsRefreshed.contains(onClickStreamRefreshedForCurrentView)) {
      refreshOnClickStreams(view);
    }

    return onClickStreamGroup.stream;
  }

  /// Binds the onClick listener to the active views.
  void refreshOnClickStreams(JsView view) {
    onClickStreamGroup.add(_getCurrentOnClickStreams(view));
  }

  /// Gets the current onClick stream for the active views.
  Stream<Attributes?> _getCurrentOnClickStreams(JsView view) {
    final StreamController<Attributes?> controller = StreamController();

    view.on(
      ['click'],
      allowInterop((event) async {
        if (!controller.isClosed) {
          final JsHitTestResult hitTestResult =
              await view.hitTest(event).toFuture();
          final int resultsLength = hitTestResult.results?.length ?? 0;

          if (resultsLength > 0 &&
              hitTestResult.results![0].graphic?.attributes.id != null) {
            final graphicAttributes =
                hitTestResult.results![0].graphic!.attributes;

            controller.add(Attributes(jsNativeObjectToMap(graphicAttributes)));
          } else {
            controller.add(null);
          }
        }
      }),
    );

    // Merge all the zoom streams into one
    return controller.stream;
  }

  static const zoomStreamRefreshedForCurrentView =
      'zoomStreamRefreshedForCurrentView';

  /// Returns a Stream with the zoom level of the view.
  Stream<double> getZoom(JsView view) {
    if (!streamsRefreshed.contains(zoomStreamRefreshedForCurrentView)) {
      refreshZoomStreams(view);
    }
    return zoomStreamGroup.stream;
  }

  /// Binds the [getZoom] to the active views.
  void refreshZoomStreams(JsView view) {
    zoomStreamGroup.add(_getCurrentZoomStreams(view));
  }

  /// Gets the current [zoom] stream for the active views.
  Stream<double> _getCurrentZoomStreams(JsView view) {
    streamsRefreshed.add(zoomStreamRefreshedForCurrentView);
    // In order to stop watching on the zoom when the stream is canceled in Dart,
    // a handle is assigned to the watch method, and it is removed when the Stream is canceled.
    WatchHandle? handle;
    final StreamController<double> controller =
        StreamController(onCancel: () => handle?.remove());

    handle = watch(
      allowInterop(() => view.zoom),
      allowInterop((zoom, _) {
        if (!controller.isClosed && zoom as double > 0) {
          controller.add(zoom);
        }
      }),
    );

    // Merge all the zoom streams into one
    return controller.stream;
  }

  static const centerPositionStreamRefreshedForCurrentView =
      'centerPositionStreamRefreshedForCurrentView';

  /// Return a Stream that emits the center position of the current view.
  Stream<LatLng> getCenterPosition(JsView view) {
    if (!streamsRefreshed
        .contains(centerPositionStreamRefreshedForCurrentView)) {
      refreshCenterPositionStreams(view);
    }
    return centerPositionStreamGroup.stream;
  }

  /// Binds the [getCenterPosition] to the active views.
  void refreshCenterPositionStreams(JsView view) {
    centerPositionStreamGroup.add(_getCurrentCenterPositionStreams(view));
  }

  /// Gets the current center position stream for the active views.
  Stream<LatLng> _getCurrentCenterPositionStreams(JsView view) {
    streamsRefreshed.add(centerPositionStreamRefreshedForCurrentView);

    WatchHandle? handle;
    final StreamController<LatLng> controller =
        StreamController(onCancel: () => handle?.remove());

    handle = watch(
      allowInterop(() => view.center),
      allowInterop((center, _) {
        if (!controller.isClosed && center != null) {
          final point = center as JsPoint;
          controller.add(LatLng(point.latitude, point.longitude));
        }
      }),
    );

    // Merge all the center position streams into one
    return controller.stream;
  }

  static const visibleGraphicsStreamRefreshedForCurrentView =
      'visibleGraphicsStreamRefreshedForCurrentView';

  /// Return a Stream of Lists with the ids of the Graphics, that are visible in the current view.
  /// The List refreshes when the view is moved or zoomed.
  ///
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html#intersects
  Stream<List<String>> getVisibleGraphicsStream(
    JsView view,
    JsEsriMap map,
  ) {
    if (!streamsRefreshed
        .contains(visibleGraphicsStreamRefreshedForCurrentView)) {
      refreshVisibleGraphicsStreams(view, map);
    }
    return visibleGraphicsStreamGroup.stream;
  }

  /// Binds the [getVisibleGraphicsStream] to the active views.
  void refreshVisibleGraphicsStreams(
    JsView view,
    JsEsriMap map,
  ) {
    visibleGraphicsStreamGroup.add(
      _getCurrentVisibleGraphicsStreams(view, map),
    );
  }

  /// Gets the current center visible graphics stream for the active views.
  Stream<List<String>> _getCurrentVisibleGraphicsStreams(
    JsView view,
    JsEsriMap map,
  ) {
    streamsRefreshed.add(visibleGraphicsStreamRefreshedForCurrentView);
    List<String> graphicIdsInViewBuffer = <String>[];
    WatchHandle? handle;
    final StreamController<List<String>> controller = StreamController(
      onCancel: () {
        handle?.remove();
      },
    );

    handle = watch(
      allowInterop(() => view.extent),
      allowInterop(
        (extent, _) {
          if (!controller.isClosed) {
            final List<String> graphicIdsInView = <String>[];

            // Return all the visible graphic ids in the MapView
            view.graphics.forEach(
              allowInterop((JsGraphic graphic, _, __) {
                final bool isInView = (extent as JsExtent?)
                        ?.intersects(graphic.geometry.extent) ??
                    false;
                if (isInView) {
                  graphicIdsInView.add(graphic.attributes.id);
                }
              }),
            );

            // Return all the visible graphic ids in the graphic layers
            final layers = map.layers;
            layers?.forEach(
              allowInterop((layer, _, __) {
                if (layer is JsGraphicsLayer) {
                  layer.graphics?.forEach(
                    allowInterop((JsGraphic graphic, _, __) {
                      final bool isInView = (extent as JsExtent?)
                              ?.intersects(graphic.geometry.extent) ??
                          false;
                      if (isInView) {
                        graphicIdsInView.add(graphic.attributes.id);
                      }
                    }),
                  );
                }
              }),
            );

            if (!listEquals(graphicIdsInViewBuffer, graphicIdsInView)) {
              controller.add(graphicIdsInView);
              graphicIdsInViewBuffer = graphicIdsInView;
            }
          }
        },
      ),
    );
    // Merge all the streams into one
    return controller.stream;
  }

  /// Return a List with the ids of the Graphics, that are visible in the current view, on demand.
  ///
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html#intersects
  List<String> getVisibleGraphicIds(
    JsView view,
    JsEsriMap map,
  ) {
    final extent = view.extent;

    // Return all the visible graphic ids in the MapView
    final List<String> graphicIdsInView = <String>[];
    view.graphics.forEach(
      allowInterop((JsGraphic graphic, _, __) {
        final bool isInView = extent.intersects(graphic.geometry.extent);
        if (isInView) {
          graphicIdsInView.add(graphic.attributes.id);
        }
      }),
    );

    // Return all the visible graphic ids in the graphic layers
    final layers = map.layers;
    layers?.forEach(
      allowInterop((layer, _, __) {
        if (layer is JsGraphicsLayer) {
          layer.graphics?.forEach(
            allowInterop((JsGraphic graphic, _, __) {
              final bool isInView = extent.intersects(graphic.geometry.extent);
              if (isInView) {
                graphicIdsInView.add(graphic.attributes.id);
              }
            }),
          );
        }
      }),
    );

    return graphicIdsInView;
  }

  /// A stream for the 'Extent' attributes
  ///
  /// Link to the Javascript API reference
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html
  Stream<BoundingBox> getBoundsStream(JsView view) {
    if (!streamsRefreshed.contains(boundsStreamRefreshedForCurrentView)) {
      refreshBoundsStreams(view);
    }
    return boundsStreamGroup.stream;
  }

  static const boundsStreamRefreshedForCurrentView =
      'refreshBoundsStreamRefreshedForCurrentView';

  /// Binds the [getBoundsStream] to the active views.
  void refreshBoundsStreams(JsView view) {
    boundsStreamGroup.add(_getCurrentBoundsStreams(view));
  }

  /// Gets the current bounds streams of the active views.
  Stream<BoundingBox> _getCurrentBoundsStreams(JsView view) {
    streamsRefreshed.add(boundsStreamRefreshedForCurrentView);
    // In order to stop watching on the bounds when the stream is canceled in Dart,
    // a handle is assigned to the watch method, and it is removed when the Stream is canceled.
    WatchHandle? handle;
    final StreamController<BoundingBox> controller =
        StreamController(onCancel: () => handle?.remove());

    handle = watch(
      allowInterop(() => view.extent),
      allowInterop(
        (newValue, _) {
          if (newValue is JsExtent && !controller.isClosed) {
            final centerViewPoint =
                LatLng(newValue.center.latitude, newValue.center.longitude);
            final xDistanceFromViewCenter = newValue.width / 2;
            final yDistanceFromViewCenter = newValue.height / 2;

            // Lower left point
            final latLngMin = BoundingBox.getLatLngFromMapUnits(
              referencePoint: centerViewPoint,
              x: -xDistanceFromViewCenter,
              y: -yDistanceFromViewCenter,
            );

            // Top right point
            final latLngMax = BoundingBox.getLatLngFromMapUnits(
              referencePoint: centerViewPoint,
              x: xDistanceFromViewCenter,
              y: yDistanceFromViewCenter,
            );

            controller.add(
              BoundingBox(
                height: newValue.height,
                width: newValue.width,
                lowerLeft: latLngMin,
                topRight: latLngMax,
              ),
            );
          }
        },
      ),
    );

    return controller.stream;
  }

  static const attributionStreamRefreshedForCurrentView =
      'attributionStreamRefreshedForCurrentView';

  /// Get the attribution text as a [Stream]
  /// It changes depending on the [BaseMap] and the map's position
  Stream<String> getAttributionStream(JsView view) {
    if (!streamsRefreshed.contains(attributionStreamRefreshedForCurrentView)) {
      refreshAttributionStreams(view);
    }

    return attributionTextStreamGroup.stream;
  }

  /// Binds the [getAttributionStream] to the active views.
  void refreshAttributionStreams(JsView view) {
    attributionTextStreamGroup.add(
      _getCurrentAttributionStreams(view),
    );
  }

  /// Gets the current attribution streams of the active views.
  Stream<String> _getCurrentAttributionStreams(JsView view) {
    streamsRefreshed.add(attributionStreamRefreshedForCurrentView);
    // In order to stop watching on the JsAttribution when the stream is canceled in Dart,
    // a handle is assigned to the watch method, and it is removed when the Stream is canceled.

    WatchHandle? handle;
    final StreamController<String> controller =
        StreamController(onCancel: () => handle?.remove());

    // A Javascript widget is created to get the Stream with the attribution text, then it is removed from the view,
    // so that a custom widget can be implemented in Dart.
    final attributionWidget = Attribution().init(view: view);
    view.ui.add(attributionWidget, "manual");

    handle = watch(
      allowInterop(() => attributionWidget.attributionText),
      allowInterop((newValue, _) {
        if (newValue is String && newValue.isNotEmpty && !controller.isClosed) {
          controller.add(newValue);
        }
      }),
    );
    view.ui.remove(attributionWidget);

    // Merge all the streams into one
    return controller.stream;
  }

  /// Stops propagating events that trigger map movement such as zooming and panning.
  JsHandle preventInteraction(JsView view) => view.on(
        ['key-down', 'drag', 'double-click', 'mouse-wheel'],
        // ignore: avoid_dynamic_calls
        allowInterop((event) => event.stopPropagation()),
      );

  /// Changes the mouse cursor to a specified [SystemMouseCursor].
  void setMouseCursor(String mapId, SystemMouseCursor cursor) {
    final setCursor = cursor.kind == 'basic' ? 'default' : 'pointer';
    (document.getElementById(mapId) as HTMLElement?)?.style.cursor = setCursor;
  }

  /// Updates the graphic representation of an existing polygon via the [SimpleFillSymbol].
  void updateGraphicSymbol({
    required JsEsriMap map,
    required String layerId,
    required Symbol symbol,
    required String graphicId,
  }) {
    final layer = map.findLayerById(layerId);
    if (layer is JsGraphicsLayer) {
      final JsGraphic? graphic = layer.graphics?.find(
        allowInterop((JsGraphic graphic, _, __) {
          final result = graphic.attributes.id;
          return result == graphicId;
        }),
      );

      if (graphic != null) graphic.set('symbol', jsify(symbol.toJson()));
    } else {
      throw Exception('GraphicsLayer with the id:$layerId not found');
    }
  }

  /// Updates the existing layer
  /// Only supported by [FeatureLayer]s
  Future<void> updateFeatureLayer({
    required JsEsriMap map,
    required String featureLayerId,
    required List<Graphic> data,
  }) async {
    final layer = map.findLayerById(featureLayerId);
    if (layer is JsFeatureLayer) {
      final JsFeatureSet layerInfo = await layer.queryFeatures().toFuture();
      await _addFeatures(
        map: map,
        features: layerInfo.features,
        featureLayerId: featureLayerId,
        data: data,
      );
    } else {
      debugPrint('FeatureLayer with the id:$featureLayerId not found');
    }
  }

  /// Removes the layer with [layerId] from the map
  bool destroyLayer({
    required JsEsriMap map,
    required String layerId,
  }) {
    final layer = map.findLayerById(layerId);
    if (layer is JsGraphicsLayer) {
      layer.destroy();

      for (final layer in _layers.toList()) {
        if (layer.id == layerId) {
          layer.destroy();
          _layers.remove(layer);
        }
      }

      return true;
    }
    return false;
  }

  /// Removes the 3D layers for the 2D view and saves them in the [_temp3DLayers] list.
  /// Types => https://developers.arcgis.com/javascript/latest/api-reference/esri-views-View.html#type
  void remove3dLayers({
    required JsEsriMap map,
    List<String> layerTypes = const ['scene'],
  }) {
    final filteredLayers = map.layers?.filter(
      allowInterop((JsLayer layer, _, __) {
        return layerTypes.contains(layer.type);
      }),
    );

    filteredLayers?.forEach(
      allowInterop((JsLayer layer, _, __) {
        _temp3DLayers.add(layer);
        _layers.remove(layer);
        destroyLayer(map: map, layerId: layer.id);
      }),
    );
  }

  /// Adds the 3D layers for the 3D view saved in the [_temp3DLayers] list.
  Future<void> add3dLayers({
    required JsEsriMap map,
  }) async {
    for (final JsLayer layer in _temp3DLayers) {
      /// Instead of reusing the old layer we have to create a new one.
      /// "The layer can no longer be used once it has been destroyed."
      /// => https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-Layer.html#destroy
      createSceneLayer(
        layerId: layer.id,
        options: SceneLayerOptions(
          symbol: const MeshSymbol3D(
            color: Color(0xFFFF8282),
          ),
        ),
        url: layer.url,
        map: map,
      );

      _layers.add(layer);
    }
    _temp3DLayers.clear();
  }

  /// Adds features to the FeatureLayer with [featureLayerId].
  /// Only supported by [FeatureLayer]s
  Future<void> _addFeatures({
    required JsEsriMap map,
    required String featureLayerId,
    required List<Graphic> data,
    dynamic features,
  }) async {
    final layer = map.findLayerById(featureLayerId);
    if (layer is JsFeatureLayer) {
      await layer
          .applyEdits(
            jsify({
              "deleteFeatures": features,
              "addFeatures": data.map((Graphic graphic) => graphic.toJson()),
            }),
          )
          .toFuture();
    } else {
      debugPrint('FeatureLayer with the id:$featureLayerId not found');
    }
  }

  /// Adds padding to the map to help re-centering the view.
  ///
  /// This is particularly useful when the map is partially overlayed by other UI elements.
  void addViewPadding({required JsView view, required ViewPadding padding}) {
    view.padding = jsify({
      "left": padding.left,
      "top": padding.top,
      "right": padding.right,
      "bottom": padding.bottom,
    });
  }

  bool _isZoomInBounds(double zoom) {
    return zoom >= minZoom && zoom <= maxZoom;
  }

  /// Go to the given point and zoom if wanted
  Future<void> moveCamera({
    required LatLng point,
    required JsView view,
    double? zoomLevel,
    AnimationOptions? animationOptions,
  }) async {
    final jsPoint = JsPoint(
      jsify({'latitude': point.latitude, 'longitude': point.longitude}),
    );

    final Map target = {'target': jsPoint};

    if (zoomLevel != null) {
      if (_isZoomInBounds(zoomLevel)) {
        target.addAll({'zoom': zoomLevel});
      } else {
        throw Exception(
          'Zoom level $zoomLevel is out of bounds'
          '\nZoom values range from $minZoom to $maxZoom',
        );
      }
    }

    final Map targetOptions = {};

    if (animationOptions != null) {
      targetOptions.addAll({
        'duration': animationOptions.duration,
        'easing': animationOptions.animationCurve.value,
      });
    }

    await view.goTo(jsify(target), jsify(targetOptions)).toFuture();
  }

  /// Zoom in by a Level Of Detail Factor
  Future<bool> zoomIn({
    required int lodFactor,
    required JsView view,
    AnimationOptions? animationOptions,
  }) async {
    final currentZoomLevel = view.zoom;
    if (currentZoomLevel >= maxZoom) return false;
    final newZoomLevel = currentZoomLevel + lodFactor;
    if (_isZoomInBounds(newZoomLevel)) {
      final Map targetOptions = {};

      if (animationOptions != null) {
        targetOptions.addAll({
          'duration': animationOptions.duration,
          'easing': animationOptions.animationCurve.value,
        });
      }

      view.goTo(jsify({'zoom': newZoomLevel}), jsify(targetOptions)).toFuture();
      return true;
    } else {
      throw Exception(
        'Zoom: $newZoomLevel for zoom in is out of bounds'
        '\nZoom values range from $minZoom to $maxZoom',
      );
    }
  }

  /// Zoom out by a Level Of Detail Factor
  Future<bool> zoomOut({
    required int lodFactor,
    required JsView view,
    AnimationOptions? animationOptions,
  }) async {
    final currentZoomLevel = view.zoom;
    if (currentZoomLevel <= minZoom) return false;
    final newZoomLevel = currentZoomLevel - lodFactor;
    if (_isZoomInBounds(newZoomLevel)) {
      final Map targetOptions = {};

      if (animationOptions != null) {
        targetOptions.addAll({
          'duration': animationOptions.duration,
          'easing': animationOptions.animationCurve.value,
        });
      }
      view.goTo(jsify({'zoom': newZoomLevel}), jsify(targetOptions)).toFuture();
      return true;
    } else {
      throw Exception(
        'Zoom: $newZoomLevel for zoom out is out of bounds'
        '\nZoom values range from $minZoom to $maxZoom',
      );
    }
  }

  /// Add a [Graphic] to a specific [graphicsLayer].
  Future<void> addGraphic(JsEsriMap map, String layerId, Graphic graphic) {
    final layer = map.findLayerById(layerId);
    if (layer is JsGraphicsLayer) {
      final String graphicId = graphic.getAttributesId();
      if (!_graphicObjectIds.contains(graphicId)) {
        layer.graphics?.add(jsify(graphic.toJson()));
        _graphicObjectIds.add(graphicId);
      } else {
        throw Exception(
          'A graphic with the id:$graphicId is already in use'
          '\nPlease set another id to your graphic',
        );
      }
    } else {
      throw Exception('GraphicsLayer with the id:$layerId not found');
    }

    if (graphic.onHover == null &&
        graphic.onEnter == null &&
        graphic.onExit == null) {
      return Future(() => null);
    }
    _graphics[graphic] = HoveredState.notHovered;
    return Future(() => null);
  }

  final _deBouncer = DeBouncer(milliseconds: 8);

  /// Register a global pointer-move event handler to detect when the mouse cursor hovers over a Graphic.
  /// This is used to detect when the mouse cursor hovers over a Graphic in any layer.
  ///
  /// When adding new layer, you have to call it again to register the new layer.
  JsHandle registerGlobalPointerMoveEventHandler(JsEsriMap map, JsView view) {
    bool executing = false;
    return view.on(
      ['pointer-move'],
      allowInterop((event) {
        if (executing) return;
        _deBouncer.run(
          () async {
            try {
              executing = true;
              // Just show results from graphics layers
              final graphicsLayers = map.layers?.filter(
                allowInterop((JsLayer layer, _, __) {
                  return layer.type == 'graphics';
                }),
              );
              final JsHitTestResult hitTestResult = await view
                  .hitTest(
                    event,
                    jsify({
                      'include': graphicsLayers,
                    }),
                  )
                  .toFuture();

              final int resultsLength = hitTestResult.results?.length ?? 0;
              // Returns true when the mouse cursor hovers over at least one Graphic in any layer
              isGraphicHoveredStreamController.add(resultsLength >= 1);
              _setGraphicsHoverStatus(resultsLength, hitTestResult);
            } finally {
              executing = false;
            }
          },
        );
      }),
    );
  }

  void _setGraphicsHoverStatus(
    int resultsLength,
    JsHitTestResult hitTestResult,
  ) {
    if (resultsLength < 1 ||
        hitTestResult.results?[0].graphic?.attributes == null) {
      return;
    }
    final String? hitTestId = hitTestResult.results?[0].graphic?.attributes.id;
    for (final Graphic graphic in _graphics.keys) {
      if (hitTestId == graphic.getAttributesId()) {
        graphic.onHover?.call(true);
        if (_graphics[graphic] == HoveredState.notHovered) {
          graphic.onEnter?.call();
          _graphics[graphic] = HoveredState.hovered;
        }
      } else {
        graphic.onHover?.call(false);
        if (_graphics[graphic] == HoveredState.hovered) {
          graphic.onExit?.call();
          _graphics[graphic] = HoveredState.notHovered;
        }
      }
    }
  }

  /// Remove a [Graphic] from a layer, given its [graphicId]
  Future<void> removeGraphic(JsEsriMap map, String layerId, String graphicId) {
    final layer = map.findLayerById(layerId);
    if (layer is JsGraphicsLayer) {
      layer.graphics?.forEach(
        allowInterop((JsGraphic graphic, _, __) {
          if (graphic.attributes.id == graphicId) {
            layer.remove(graphic);
            _graphicObjectIds.remove(graphicId);
          }
        }),
      );
      return Future(() => null);
    } else {
      throw Exception('Layer with the id:$layerId not found');
    }
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
    required JsEsriMap map,
    String? layerId,
    String? removeByAttributeKey,
    String? removeByAttributeValue,
    String? excludeAttributeKey,
    List<String>? excludeAttributeValues,
  }) {
    if (layerId != null) {
      final layer = map.findLayerById(layerId);
      if (layer is JsGraphicsLayer) {
        _removeGraphicsFromLayer(
          layer: layer,
          removeByAttributeKey: removeByAttributeKey,
          removeByAttributeValue: removeByAttributeValue,
          excludeAttributeKey: excludeAttributeKey,
          excludeAttributeValues: excludeAttributeValues,
        );
      }
    } else {
      // Remove the graphics from every Graphic Layer
      map.layers?.forEach(
        allowInterop((layer, _, __) {
          if (layer is JsGraphicsLayer) {
            _removeGraphicsFromLayer(
              layer: layer,
              removeByAttributeKey: removeByAttributeKey,
              removeByAttributeValue: removeByAttributeValue,
              excludeAttributeKey: excludeAttributeKey,
              excludeAttributeValues: excludeAttributeValues,
            );
          }
        }),
      );
    }
  }

  void _removeGraphicsFromLayer({
    required JsGraphicsLayer layer,
    String? removeByAttributeKey,
    String? removeByAttributeValue,
    String? excludeAttributeKey,
    List<String>? excludeAttributeValues,
  }) {
    if (removeByAttributeKey == null) {
      layer.removeAll();
      // Remove the graphics from the list that tracks the hovered state.
      _graphicObjectIds.clear();
      _graphics.clear();
      return;
    }
    final graphicsCollection = layer.graphics?.filter(
      allowInterop((JsGraphic jsGraphic, _, __) {
        final dartGraphic = jsNativeObjectToMap(jsGraphic);
        final result = (dartGraphic['attributes']
            as Map?)?[removeByAttributeKey] as String?;
        final removeGraphic = result == removeByAttributeValue;
        if (removeGraphic) {
          if (excludeAttributeKey != null && excludeAttributeValues != null) {
            final resultAttributeToKeep = (dartGraphic['attributes']
                as Map?)?[excludeAttributeKey] as String?;
            final keepGraphic =
                excludeAttributeValues.contains(resultAttributeToKeep);
            return !keepGraphic;
          }
          return removeGraphic;
        }
        return false;
      }),
    );

    layer.graphics?.removeMany(graphicsCollection);

    // Remove the graphics from the list that tracks the hovered state.
    final List<String> graphicIdsToRemove = [];
    graphicsCollection?.forEach(
      allowInterop((JsGraphic jsGraphic, _, __) {
        final dartGraphic = jsNativeObjectToMap(jsGraphic);
        graphicIdsToRemove
            .add((dartGraphic['attributes'] as Map?)?['id'] as String);
      }),
    );
    _graphicObjectIds
        .removeWhere((graphicId) => graphicIdsToRemove.contains(graphicId));
    _graphics.removeWhere(
      (graphic, _) => graphicIdsToRemove.contains(graphic.getAttributesId()),
    );
  }

  /// Toggle the basemap of the [view] to the [baseMap] and show the labels
  /// beneath the graphics.
  Future<void> toggleBaseMap({
    required JsView view,
    required BaseMap baseMap,
    required JsEsriMap map,
    required String? apiKey,
    bool? showLabelsBeneathGraphics,
  }) async {
    final basemapToggle = BasemapToggle(
      jsify({
        "viewModel": jsify({"view": view, "nextBasemap": baseMap.value}),
      }),
    );

    // The toggle action is initiated here, but we don't need to await it directly.
    // The loading state is monitored by the watch in ArcgisMapWebController._createMap.
    basemapToggle.toggle();

    if (showLabelsBeneathGraphics == true) {
      final Completer<void> baseMapLoaded = Completer();

      // Watch for the basemap load status after initiating the toggle
      final handle = watch(
        allowInterop(() => basemapToggle.activeBasemap.loaded),
        allowInterop((loaded, _) {
          if (loaded as bool && !baseMapLoaded.isCompleted) {
            baseMapLoaded.complete();
          }
        }),
      );

      await baseMapLoaded.future;
      // Remove the watch handle once the basemap is loaded
      handle.remove();

      // Destroy the recreated labels layer, if it exists, so that it can be replaced by the new one.
      _recreatedLabelsLayer?.destroy();
      _recreatedLabelsLayer = null;

      moveBaseMapLabelsToBackground(
        map: map,
        baseMap: basemapToggle.activeBasemap,
        apiKey: apiKey,
      );
    }
  }

  /// Enable/disable the 3D ground elevation of the [map].
  void setGroundElevation({
    required JsEsriMap map,
    required bool enable,
  }) {
    map.ground = enable ? Ground.worldElevation.value : null;
  }

  /// Moves the labels of the basemap to the back of the map. This
  /// allows the labels to be displayed beneath the graphics.
  ///
  /// This is a workaround for the issue that the labels of the basemap are always displayed on top of the graphics.
  /// Since there is no way to reorder the layers of the map, we have to recreate the labels layer.
  /// Then the API allows us to push the layer to the back of the map.
  void moveBaseMapLabelsToBackground({
    required JsEsriMap map,
    required JsBaseMap baseMap,
    required String? apiKey,
  }) {
    // Get the reference layer of the base map, which is the labels layer.
    final labelsLayers = baseMap.referenceLayers;

    String? labelsLayerUrl;

    // Get the url of the labels layer, so that we can recreate it.
    labelsLayers.forEach(
      allowInterop((JsLayer layer, _, __) {
        labelsLayerUrl = layer.url;
        // Remove the existing labels layer from the map.
        layer.destroy();
      }),
    );

    // By recreating the labels layer, it allows us to push it to the back of the map.
    _recreatedLabelsLayer =
        VectorLayer().init(url: labelsLayerUrl!, apiKey: apiKey);

    if (_recreatedLabelsLayer != null) {
      _layers.add(_recreatedLabelsLayer!);

      // Add layer to map, not a promise
      map.add(_recreatedLabelsLayer);

      // Move the labels layer to the back.
      map.reorder(_recreatedLabelsLayer, 0);
    }
  }
}

class DeBouncer {
  final int milliseconds;
  VoidCallback? action;
  Timer? _timer;

  DeBouncer({required this.milliseconds});

  void run(VoidCallback action) {
    if (_timer != null) {
      _timer?.cancel();
    }

    _timer = Timer(Duration(milliseconds: milliseconds), action);
  }
}
