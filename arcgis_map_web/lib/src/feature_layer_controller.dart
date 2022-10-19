import 'dart:async';
import 'dart:html' hide VoidCallback;
import 'dart:js';
import 'dart:js_util';

import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:arcgis_map_web/arcgis_map_web.dart';
import 'package:arcgis_map_web/src/arcgis_map_web_controller.dart';
import 'package:arcgis_map_web/src/components/attribution.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

enum HoveredState { hovered, notHovered }

class FeatureLayerController {
  final int minZoom;
  final int maxZoom;

  final List<JsFeatureLayer> featureLayers = <JsFeatureLayer>[];
  final List<String> _graphicObjectIds = <String>[];

  /// Track the listeners of the graphics, in order to remove them when the graphic is removed
  ///
  /// Each dynamic handle has a unique graphics Id
  final Map<String, dynamic> _activeHandles = <String, dynamic>{};
  late JsFeatureLayer layer;

  FeatureLayerController({required this.minZoom, required this.maxZoom});

  /// Map of [Graphic] and its [HoveredState] in the map view.
  /// Needed for the [registerGlobalPointerMoveEventHandler]
  ///
  /// With the use of hovered state, continuous callbacks are avoided for [Graphic.onEnter]
  /// and [Graphic.onExit].
  final Map<Graphic, HoveredState> _graphics = {};

  /// Get the [Graphic] in the map view
  List<Graphic> get graphicsInView => _graphics.keys.toList();

  Future<FeatureLayer> createLayer(
    FeatureLayerOptions options,
    List<Graphic>? data,
    void Function(dynamic)? onPressed,
    String? url,
    void Function(double)? getZoom,
    String layerId,
    JsEsriMap map,
    JsMapView view,
  ) async {
    // Create a layer from a backend service
    if (url != null) {
      layer = JsFeatureLayer(
        jsify({"url": url}),
      );
    } else {
      // Checks if a feature layer with the layerId is already in use
      if (!featureLayers
          .map((featureLayer) => featureLayer.id)
          .toList(growable: false)
          .contains(layerId)) {
        layer = JsFeatureLayer(
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
    map.add(layer);

    // Set onClick Listener
    if (onPressed != null) {
      view.on(
        ['click'],
        allowInterop((event) async {
          final JsHitTestResult hitTestResult =
              await view.hitTest(event).toFuture();
          if (hitTestResult.results?.isNotEmpty ?? false) {
            for (final HitTestResultItem result in hitTestResult.results!) {
              final Map item =
                  result.graphic.attributes as Map<dynamic, dynamic>;
              onPressed(item);
            }
          }
        }),
      );
    }

    featureLayers.add(layer);

    final FeatureLayer _featureLayer = FeatureLayer(id: layer.id);

    return _featureLayer;
  }

  /// Check if the polygon with the [polygonId] contains the point with the
  /// [pointCoordinates]
  bool graphicContainsPoint({
    required JsMapView view,
    required String polygonId,
    required LatLng pointCoordinates,
  }) {
    final JsGraphic? graphic = view.graphics.find(
      allowInterop((JsGraphic graphic, _, __) {
        final result = graphic.attributes.id as String?;
        return result == polygonId;
      }),
    );
    if (graphic == null) return false;
    final bool isInView = graphic.geometry.extent.contains(
      JsPoint(
        jsify({
          'latitude': pointCoordinates.latitude,
          'longitude': pointCoordinates.longitude,
        }),
      ),
    );
    return isInView;
  }

  /// Callback for the 'zoom' level of the map
  Stream<double> getZoom(JsMapView view) {
    // In order to stop watching on the zoom when the stream is canceled in Dart,
    // a handle is assigned to the watch method, and it is removed when the Stream is canceled.
    dynamic handle;
    final StreamController<double> _zoomController =
        StreamController(onCancel: () => handle.remove());
    handle = view.watch(
      'zoom',
      allowInterop(
        (newValue, _, __, ___) {
          _zoomController.add(newValue as double);
        },
      ),
    );

    return _zoomController.stream;
  }

  /// A stream for the 'center' attributes
  ///
  /// Returns the center position of the current view
  Stream<LatLng> centerPosition(JsMapView view) {
    // In order to stop watching on the center position when the stream is canceled in Dart,
    // a handle is assigned to the watch method, and it is removed when the Stream is canceled.
    dynamic handle;

    final StreamController<LatLng> _positionController = StreamController(
      onCancel: () {
        handle.remove();
      },
    );

    handle = view.watch(
      'center',
      allowInterop(
        (newValue, _, __, ___) {
          if (newValue != null) {
            final _centerViewPoint = LatLng(
              newValue.latitude as double,
              newValue.longitude as double,
            );
            _positionController.add(_centerViewPoint);
          }
        },
      ),
    );

    return _positionController.stream;
  }

  /// Return a Stream of Lists with the ids of the Graphics, that are visible in the current view.
  /// The List refreshes when the view is moved or zoomed.
  ///
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html#intersects
  Stream<List<String>> visibleGraphics(JsMapView view) {
    List<String> graphicIdsInViewBuffer = <String>[];
    dynamic handle;
    final StreamController<List<String>> _visibleGraphicsController =
        StreamController(
      onCancel: () {
        handle?.remove();
      },
    );
    handle = view.watch(
      'extent',
      allowInterop((newValue, _, __, ___) {
        final List<String> graphicIdsInView = <String>[];
        view.graphics.forEach(
          allowInterop((graphic, _, __) {
            final bool isInView =
                (newValue as JsExtent?)?.intersects(graphic.geometry.extent) ??
                    false;
            if (isInView) {
              graphicIdsInView.add(graphic.attributes.id as String);
            }
          }),
        );
        if (!listEquals(graphicIdsInViewBuffer, graphicIdsInView)) {
          _visibleGraphicsController.add(graphicIdsInView);
          graphicIdsInViewBuffer = graphicIdsInView;
        }
      }),
    );
    return _visibleGraphicsController.stream;
  }

  /// Return a List with the ids of the Graphics, that are visible in the current view, on demand.
  ///
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html#intersects
  List<String> getVisibleGraphicIds(JsMapView view) {
    final extent = view.get('extent') as JsExtent?;

    final List<String> graphicIdsInView = <String>[];
    view.graphics.forEach(
      allowInterop((graphic, _, __) {
        final bool isInView =
            extent?.intersects(graphic.geometry.extent) ?? false;
        if (isInView) {
          graphicIdsInView.add(graphic.attributes.id as String);
        }
      }),
    );
    return graphicIdsInView;
  }

  /// A stream for the 'Extent' attributes
  ///
  /// Link to the Javascript API reference
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html
  Stream<BoundingBox> getBounds(JsMapView view) {
    // In order to stop watching on the extent when the stream is canceled in Dart,
    // a handle is assigned to the watch method, and it is removed when the Stream is canceled.
    dynamic handle;
    final StreamController<BoundingBox> _boundsController = StreamController(
      onCancel: () {
        handle?.remove();
      },
    );

    handle = view.watch(
      'extent',
      allowInterop((newValue, _, __, ___) {
        if (newValue is JsExtent) {
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

          _boundsController.add(
            BoundingBox(
              height: newValue.height,
              width: newValue.width,
              lowerLeft: latLngMin,
              topRight: latLngMax,
            ),
          );
        }
      }),
    );
    return _boundsController.stream;
  }

  /// Get the attribution text as a [Stream]
  /// It changes depending on the [BaseMap] and the map's position
  Stream<String> attributionText(JsMapView view) {
    // In order to stop watching on the JsAttribution when the stream is canceled in Dart,
    // a handle is assigned to the watch method, and it is removed when the Stream is canceled.
    dynamic handle;
    final StreamController<String> attributionController =
        StreamController(onCancel: () => handle?.remove());

    WidgetsBinding.instance.addPostFrameCallback((_) {
      // A Javascript widget is created to get the Stream with the attribution text, then it is removed from the view,
      // so that a custom widget can be implemented in Dart.
      final attributionWidget = Attribution().init(view: view);
      view.ui.add(attributionWidget, "manual");
      handle = attributionWidget.watch(
        'attributionText',
        allowInterop(
          (newValue, _, __, ___) {
            attributionController.add(newValue as String);
          },
        ),
      );
      view.ui.remove(attributionWidget);
    });

    return attributionController.stream;
  }

  /// Stops propagating events that trigger map movement such as zooming and panning.
  Handle preventInteraction(JsMapView view) => view.on(
        ['key-down', 'drag', 'double-click', 'mouse-wheel'],
        allowInterop((event) => event.stopPropagation()),
      );

  /// Changes the mouse cursor to a specified [SystemMouseCursor].
  void setMouseCursor(String mapId, SystemMouseCursor cursor) {
    final _cursor = cursor.kind == 'basic' ? 'default' : 'pointer';
    document.getElementById(mapId)?.style.cursor = _cursor;
  }

  /// Updates the graphic representation of an existing polygon via the [SimpleFillSymbol].
  void updateGraphicSymbol({
    required JsMapView view,
    required Symbol symbol,
    required String polygonId,
  }) {
    final JsGraphic? graphic = view.graphics.find(
      allowInterop((JsGraphic graphic, _, __) {
        final result = graphic.attributes.id as String?;
        return result == polygonId;
      }),
    );

    if (graphic != null) graphic.set('symbol', jsify(symbol.toJson()));
  }

  /// Set onClick Listener to the Map View
  /// Returns a callback with Attributes of the clicked object
  ///
  /// If the click does not find any object on the map, it returns null.
  void onClick(JsMapView view, void Function(ArcGisMapAttributes?) onPressed) {
    view.on(
      ['click'],
      allowInterop((event) async {
        final JsHitTestResult hitTestResult =
            await view.hitTest(event).toFuture();
        final int resultsLength = hitTestResult.results?.length ?? 0;

        if (resultsLength > 0 &&
            hitTestResult.results![0].graphic.attributes.id != null) {
          final graphicAttributes =
              hitTestResult.results![0].graphic.attributes;
          onPressed(
            ArcGisMapAttributes(
              id: graphicAttributes.id as String,
              name: graphicAttributes.name as String,
            ),
          );
        } else {
          onPressed(null);
        }
      }),
    );
  }

  /// Updates the existing layer
  Future<void> updateLayer(List<Graphic> data) async {
    final JsFeatureSet layerInfo = await layer.queryFeatures().toFuture();
    await _addFeatures(data, layerInfo.features);
  }

  /// Removes the layer with [layerId] from the map
  bool destroyLayer(String layerId) {
    for (final layer in featureLayers) {
      if (layer.id == layerId) {
        layer.destroy();
        featureLayers.remove(layer);
        return true;
      }
    }
    return false;
  }

  Future<void> _addFeatures(List<Graphic> data, dynamic features) async {
    await layer
        .applyEdits(
          jsify({
            "deleteFeatures": features,
            "addFeatures": data.map((Graphic graphic) => graphic.toJson())
          }),
        )
        .toFuture();
  }

  /// Adds padding to the map to help re-centering the view.
  ///
  /// This is particularly useful when the map is partially overlayed by other UI elements.
  void addViewPadding({required JsMapView view, required ViewPadding padding}) {
    view.padding = jsify({
      "left": padding.left,
      "top": padding.top,
      "right": padding.right,
      "bottom": padding.bottom,
    });
  }

  bool _isZoomInBounds(int zoom) {
    return zoom >= minZoom && zoom <= maxZoom;
  }

  /// Go to the given point and zoom if wanted
  Future<void> moveCamera({
    required LatLng point,
    required JsMapView view,
    int? zoomLevel,
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
        'easing': animationOptions.animationCurve.value
      });
    }

    await view.goTo(jsify(target), jsify(targetOptions)).toFuture();
  }

  /// Zoom in by a Level Of Detail Factor
  Future<void> zoomIn(int lodFactor, JsMapView view) async {
    final currentZoomLevel = view.zoom.toInt();
    if (currentZoomLevel == maxZoom) return;
    final newZoomLevel = currentZoomLevel + lodFactor;
    if (_isZoomInBounds(newZoomLevel)) {
      await view.goTo(jsify({'zoom': newZoomLevel})).toFuture();
    } else {
      throw Exception(
        'Zoom: $newZoomLevel for zoom in is out of bounds'
        '\nZoom values range from $minZoom to $maxZoom',
      );
    }
  }

  /// Zoom out by a Level Of Detail Factor
  Future<void> zoomOut(int lodFactor, JsMapView view) async {
    final currentZoomLevel = view.zoom.toInt();
    if (currentZoomLevel == minZoom) return;
    final newZoomLevel = currentZoomLevel - lodFactor;
    if (_isZoomInBounds(newZoomLevel)) {
      await view.goTo(jsify({'zoom': newZoomLevel})).toFuture();
    } else {
      throw Exception(
        'Zoom: $newZoomLevel for zoom out is out of bounds'
        '\nZoom values range from $minZoom to $maxZoom',
      );
    }
  }

  /// Add a [Graphic] to the view. It can be a polygon, a point or an image.
  ///
  /// [onEnter] and [onExit] callbacks fire when the mouse hovers over this [graphic].
  void addGraphic(JsMapView view, Graphic graphic) {
    final String graphicId = graphic.getAttributesId();
    if (!_graphicObjectIds.contains(graphicId)) {
      view.graphics.add(jsify(graphic.toJson()));
      _graphicObjectIds.add(graphicId);
    } else {
      throw Exception(
        'A graphic with the id:$graphicId is already in use'
        '\nPlease set another id to your graphic',
      );
    }

    if (graphic.onHover == null &&
        graphic.onEnter == null &&
        graphic.onExit == null) return;
    _graphics[graphic] = HoveredState.notHovered;
  }

  final _deBouncer = DeBouncer(milliseconds: 16);

  Handle registerGlobalPointerMoveEventHandler(JsMapView view) {
    bool executing = false;
    return view.on(
      ['pointer-move'],
      allowInterop((event) async {
        if (executing) return;
        _deBouncer.run(
          () async {
            try {
              executing = true;
              final JsHitTestResult hitTestResult =
                  await view.hitTest(event).toFuture();
              final int resultsLength = hitTestResult.results?.length ?? 0;
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
    if (resultsLength < 1) return;
    final String? hitTestId =
        hitTestResult.results?[0].graphic.attributes?.id as String?;
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

  /// Remove a [Graphic] from the view, given its [graphicId]
  void removeGraphic(JsMapView view, String graphicId) {
    // graphicIndex is assigned the index of the first graphic whose id
    // property is graphicId. This result is used in removeAt(), to remove
    // this graphic from the view.
    final graphicIndex = view.graphics.findIndex(
      allowInterop((JsGraphic item, _, __) {
        final result = item.attributes.id as String?;
        final bool isInTheIndex = result == graphicId;
        return isInTheIndex;
      }),
    );
    if (graphicIndex >= 0) {
      view.graphics.removeAt(graphicIndex);
    }
    _graphicObjectIds.remove(graphicId);
    // Removes the handle that is attached to this graphic
    if (_activeHandles.containsKey(graphicId)) {
      final handle = _activeHandles[graphicId];
      handle?.remove();
      _activeHandles.remove(graphicId);
    }
    _graphics
        .removeWhere((graphic, _) => graphic.getAttributesId() == graphicId);
  }

  void toggleBaseMap({required JsMapView view, required BaseMap baseMap}) {
    final basemapToggle = BasemapToggle(
      jsify({
        "viewModel": jsify({"view": view, "nextBasemap": baseMap.value})
      }),
    );

    basemapToggle.toggle();
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
