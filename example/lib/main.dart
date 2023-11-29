import 'dart:async';
import 'dart:core';

import 'package:arcgis_example/location_indicator_example_page.dart';
import 'package:arcgis_example/map_elements.dart';
import 'package:arcgis_example/vector_layer_example_page.dart';
import 'package:arcgis_map_sdk/arcgis_map_sdk.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

void main() => runApp(const ExampleApp());

const arcGisApiKey = String.fromEnvironment(
  "ARCGIS-API-KEY",
  defaultValue: "YOUR KEY HERE",
  // request API key at https://developers.arcgis.com/dashboard/
);

class ExampleApp extends StatelessWidget {
  const ExampleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'flutter_arcgis package demo',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const ExampleMap(),
    );
  }
}

/// Example 3D SceneLayer page.
class ExampleMap extends StatefulWidget {
  const ExampleMap({super.key});

  @override
  State<ExampleMap> createState() => _ExampleMapState();
}

class _ExampleMapState extends State<ExampleMap> {
  static const String _pinId1 = '123';
  final LatLng _firstPinCoordinates = const LatLng(52.9, 13.2);
  static const String _pinId2 = '456';
  final LatLng _secondPinCoordinates = const LatLng(51, 11);
  static const String _pinLayerId = 'PinLayer';
  static const String _polygon1 = 'polygon1';
  static const String _polygon2 = 'polygon2';
  static const String _polyLayerId = 'PolygonLayer';
  static const String _lineLayerId = 'LinesGraphics';

  /// null when executed on a platform that's not supported yet
  ArcgisMapController? _controller;

  StreamSubscription<BoundingBox>? _boundingBoxSubscription;
  StreamSubscription<LatLng>? _centerPositionSubscription;
  StreamSubscription<List<String>>? _graphicsInViewSubscription;
  StreamSubscription<String>? _attributionTextSubscription;
  StreamSubscription<double>? _zoomSubscription;
  StreamSubscription<bool>? _isGraphicHoveredSubscription;
  String _attributionText = '';
  bool _subscribedToBounds = false;
  bool _isFirstPinInView = false;
  bool _isSecondPinInView = false;
  bool _subscribedToCenterPosition = false;
  bool _subscribedToGraphicsInView = false;
  bool _subscribedToZoom = false;
  final Map<String, bool> _hoveredPolygons = {};

  bool show3dMap = false;
  bool _baseMapToggled = false;
  final initialCenter = const LatLng(51.16, 10.45);
  final tappedHQ = const LatLng(48.1234963, 11.5910182);
  var _isInteractionEnabled = true;

  @override
  void dispose() {
    _boundingBoxSubscription?.cancel();
    _centerPositionSubscription?.cancel();
    _graphicsInViewSubscription?.cancel();
    _attributionTextSubscription?.cancel();
    _zoomSubscription?.cancel();
    _isGraphicHoveredSubscription?.cancel();
    super.dispose();
  }

  Future<void> _onMapCreated(ArcgisMapController controller) async {
    _controller = controller;

    // TODO: Remove when mobile implementation is complete
    if (kIsWeb) {
      _controller?.onClickListener().listen((Attributes? attributes) {
        if (attributes == null) return;
        final snackBar = SnackBar(
          content:
              Text('Attributes Id after on Click: ${attributes.data['name']}'),
        );
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(snackBar);
      });

      _attributionTextSubscription =
          _controller?.attributionText().listen((attribution) {
        setState(() {
          _attributionText = attribution;
        });
      });

      // Create basic 3D Layer with elevation and 3D buildings
      await _createSceneLayer();

      // Create GraphicsLayer with Polygons
      await _createGraphicLayer(
        layerId: _polyLayerId,
        elevationMode: ElevationMode.onTheGround,
      );

      // Create GraphicsLayer with Lines
      await _createGraphicLayer(
        layerId: _lineLayerId,
        elevationMode: ElevationMode.onTheGround,
      );

      // Create GraphicsLayer with 3D Pins
      await _createGraphicLayer(layerId: _pinLayerId);

      // Subscribe to hover events to change the mouse cursor
      _isGraphicHoveredSubscription =
          _controller?.isGraphicHoveredStream().listen((bool isHovered) {
        _setMouseCursor(isHovered);
      });
    }

    _connectTwoPinsWithPolyline(
      id: 'connecting-polyline-01',
      name: 'Connecting polyline',
      start: _firstPinCoordinates,
      end: _secondPinCoordinates,
    );

    // Add Polygons to the PolyLayer
    _addPolygon(
      layerId: _polyLayerId,
      graphic: PolygonGraphic(
        rings: firstPolygon,
        symbol: orangeFillSymbol,
        attributes: Attributes({'id': _polygon1, 'name': 'First Polygon'}),
        onHover: (isHovered) {
          isHovered
              ? _updateGraphicSymbol(
                  layerId: _polyLayerId,
                  graphicId: _polygon1,
                  symbol: highlightedOrangeFillSymbol,
                )
              : _updateGraphicSymbol(
                  layerId: _polyLayerId,
                  graphicId: _polygon1,
                  symbol: orangeFillSymbol,
                );
          if (_hoveredPolygons[_polygon1] == isHovered) return;
          _hoveredPolygons[_polygon1] = isHovered;
        },
      ),
    );
  }

  void _updateGraphicSymbol({
    required String layerId,
    required String graphicId,
    required Symbol symbol,
  }) {
    _controller?.updateGraphicSymbol(
      layerId: layerId,
      symbol: symbol,
      graphicId: graphicId,
    );
  }

  void _setMouseCursor(bool isHovered) {
    _controller?.setMouseCursor(
      isHovered ? SystemMouseCursors.click : SystemMouseCursors.basic,
    );
  }

  void _subscribeToBounds() {
    _boundingBoxSubscription?.cancel();
    _boundingBoxSubscription = _controller?.getBounds().listen((bounds) {
      debugPrint(
        'LOWER LEFT  Latitude:${bounds.lowerLeft.latitude} Longitude:${bounds.lowerLeft.longitude}',
      );
      debugPrint(
        'TOP RIGHT  Latitude:${bounds.topRight.latitude} Longitude:${bounds.topRight.longitude}',
      );
    });
    setState(() {
      _subscribedToBounds = true;
    });
  }

  void _unsubscribeFromBounds() {
    _boundingBoxSubscription?.cancel();
    setState(() {
      _subscribedToBounds = false;
    });
  }

  void _subscribeToGraphicsInView() {
    _graphicsInViewSubscription?.cancel();
    _graphicsInViewSubscription = _controller
        ?.visibleGraphics()
        .listen((List<String> visibleGraphicsIds) {
      visibleGraphicsIds.forEach(debugPrint);
    });
    setState(() {
      _subscribedToGraphicsInView = true;
    });
  }

  void _unSubscribeToGraphicsInView() {
    _graphicsInViewSubscription?.cancel();
    setState(() {
      _subscribedToGraphicsInView = false;
    });
  }

  void _subscribeToPos() {
    _centerPositionSubscription?.cancel();
    _centerPositionSubscription =
        _controller?.centerPosition().listen((center) {
      debugPrint("New center: $center");
    });
    setState(() {
      _subscribedToCenterPosition = true;
    });
  }

  void _unsubscribeFromPos() {
    _centerPositionSubscription?.cancel();
    setState(() {
      _subscribedToCenterPosition = false;
    });
  }

  void _subscribeToZoom() {
    _zoomSubscription?.cancel();
    _zoomSubscription = _controller?.getZoom().listen((zoom) {
      debugPrint('Zoom is: $zoom');
    });
    setState(() {
      _subscribedToZoom = true;
    });
  }

  void _unsubscribeFromZoom() {
    _zoomSubscription?.cancel();
    setState(() {
      _subscribedToZoom = false;
    });
  }

  void _addPin({
    required String layerId,
    required String objectId,
    required LatLng location,
  }) {
    _controller?.addGraphic(
      layerId: layerId,
      graphic: PointGraphic(
        longitude: location.longitude,
        latitude: location.latitude,
        height: 20,
        attributes: Attributes({
          'id': objectId,
          'name': objectId,
          'family': 'Pins',
        }),
        symbol: _markerSymbol,
      ),
    );
  }

  Future<SceneLayer?> _createSceneLayer() async {
    final layer = await _controller?.addSceneLayer(
      layerId: '3D Buildings',
      options: SceneLayerOptions(
        symbol: mesh3d,
      ),
      url:
          'https://basemaps3d.arcgis.com/arcgis/rest/services/OpenStreetMap3D_Buildings_v1/SceneServer',
    );
    return layer;
  }

  Future<GraphicsLayer?> _createGraphicLayer({
    required String layerId,
    ElevationMode elevationMode = ElevationMode.relativeToScene,
  }) async {
    final layer = await _controller?.addGraphicsLayer(
      layerId: layerId,
      options: GraphicsLayerOptions(
        fields: <Field>[
          Field(name: 'oid', type: 'oid'),
          Field(name: 'id', type: 'string'),
          Field(name: 'family', type: 'string'),
          Field(name: 'name', type: 'string'),
        ],
        featureReduction: FeatureReductionCluster().toJson(),
        elevationMode: elevationMode,
      ),
    );
    return layer;
  }

  void _removeGraphic({
    required String layerId,
    required String objectId,
  }) {
    _controller?.removeGraphic(layerId: layerId, objectId: objectId);
  }

  void _makePolylineVisible({required List<LatLng> points}) {
    _controller?.moveCameraToPoints(
      points: points,
      padding: 30,
    );
  }

  void _addPolygon({
    required String layerId,
    required PolygonGraphic graphic,
  }) {
    _controller?.addGraphic(
      layerId: layerId,
      graphic: graphic,
    );
  }

  void _connectTwoPinsWithPolyline({
    required String id,
    required String name,
    required LatLng start,
    required LatLng end,
  }) {
    _controller?.addGraphic(
      layerId: _lineLayerId,
      graphic: PolylineGraphic(
        paths: [
          [
            [start.longitude, start.latitude, 10.0],
            [end.longitude, end.latitude, 10.0],
          ]
        ],
        symbol: const SimpleLineSymbol(
          color: Colors.purple,
          style: PolylineStyle.shortDashDotDot,
          width: 3,
          marker: LineSymbolMarker(
            color: Colors.green,
            colorOpacity: 1,
            style: MarkerStyle.circle,
          ),
        ),
        attributes: Attributes({'id': id, 'name': name}),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          ArcgisMap(
            mapStyle: show3dMap ? MapStyle.threeD : MapStyle.twoD,
            apiKey: arcGisApiKey,
            basemap: BaseMap.osmDarkGray,
            ground: show3dMap ? Ground.worldElevation : null,
            showLabelsBeneathGraphics: true,
            initialCenter: initialCenter,
            zoom: 8,
            rotationEnabled: true,
            onMapCreated: _onMapCreated,
            defaultUiList: [
              DefaultWidget(
                viewType: DefaultWidgetType.compass,
                position: WidgetPosition.topRight,
              ),
            ],
          ),
          Positioned(
            bottom: 40,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: MediaQuery.of(context).size.width,
                  child: Wrap(
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Row(
                        children: [
                          FloatingActionButton(
                            heroTag: "zoom-in-button",
                            onPressed: () {
                              _controller?.zoomIn(
                                lodFactor: 1,
                                animationOptions: AnimationOptions(
                                  duration: 1000,
                                  animationCurve: AnimationCurve.easeIn,
                                ),
                              );
                            },
                            backgroundColor: Colors.grey,
                            child: const Icon(Icons.add),
                          ),
                          FloatingActionButton(
                            heroTag: "zoom-out-button",
                            onPressed: () {
                              _controller?.zoomOut(
                                lodFactor: 1,
                                animationOptions: AnimationOptions(
                                  duration: 1000,
                                  animationCurve: AnimationCurve.easeIn,
                                ),
                              );
                            },
                            backgroundColor: Colors.grey,
                            child: const Icon(Icons.remove),
                          ),
                          FloatingActionButton(
                            heroTag: "move-camera-button",
                            backgroundColor: Colors.red,
                            child: const Icon(Icons.place_outlined),
                            onPressed: () {
                              _controller?.moveCamera(
                                point: tappedHQ,
                                zoomLevel: 8.0,
                                threeDHeading: 30,
                                threeDTilt: 60,
                                animationOptions: AnimationOptions(
                                  duration: 1500,
                                  animationCurve: AnimationCurve.easeIn,
                                ),
                              );
                            },
                          ),
                          FloatingActionButton(
                            heroTag: "3d-map-button",
                            onPressed: () {
                              setState(() {
                                show3dMap = !show3dMap;
                                _controller?.switchMapStyle(
                                  show3dMap ? MapStyle.threeD : MapStyle.twoD,
                                );
                              });
                            },
                            backgroundColor:
                                show3dMap ? Colors.red : Colors.blue,
                            child: Text(show3dMap ? '3D' : '2D'),
                          ),
                        ],
                      ),
                      ElevatedButton(
                        onPressed: () {
                          _controller?.setInteraction(
                            isEnabled: !_isInteractionEnabled,
                          );

                          setState(() {
                            _isInteractionEnabled = !_isInteractionEnabled;
                          });
                        },
                        child: Text(
                          "${_isInteractionEnabled ? "Disable" : "Enable"} Interaction",
                        ),
                      ),
                      ElevatedButton(
                        onPressed: _routeToVectorLayerMap,
                        child: const Text("Show Vector layer example"),
                      ),
                      ElevatedButton(
                        onPressed: _routeToLocationIndicatorExample,
                        child: const Text("Location indicator example"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _baseMapToggled = !_baseMapToggled;
                            _controller?.toggleBaseMap(
                              baseMap: _baseMapToggled
                                  ? BaseMap.hybrid
                                  : BaseMap.osmDarkGray,
                            );
                          });
                        },
                        child: const Text("Toggle BaseMap"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          _controller?.addViewPadding(
                            padding: const ViewPadding(right: 300),
                          );
                        },
                        child: const Text("Add 300 right"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          _controller?.addViewPadding(
                            padding: const ViewPadding(left: 300),
                          );
                        },
                        child: const Text("Add 300 left"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          if (_isFirstPinInView) {
                            _removeGraphic(
                              layerId: _pinLayerId,
                              objectId: _pinId1,
                            );
                            setState(() {
                              _isFirstPinInView = false;
                            });
                          } else {
                            _addPin(
                              layerId: _pinLayerId,
                              objectId: _pinId1,
                              location: _firstPinCoordinates,
                            );
                            setState(() {
                              _isFirstPinInView = true;
                            });
                          }
                        },
                        child: _isFirstPinInView
                            ? const Text('Remove first Pin')
                            : const Text('Add first Pin'),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          if (_isSecondPinInView) {
                            _removeGraphic(
                              layerId: _pinLayerId,
                              objectId: _pinId2,
                            );
                            setState(() {
                              _isSecondPinInView = false;
                            });
                          } else {
                            _addPin(
                              layerId: _pinLayerId,
                              objectId: _pinId2,
                              location: _secondPinCoordinates,
                            );
                            setState(() {
                              _isSecondPinInView = true;
                            });
                          }
                        },
                        child: _isSecondPinInView
                            ? const Text('Remove second Pin')
                            : const Text('Add second Pin'),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          if (_subscribedToZoom) {
                            _unsubscribeFromZoom();
                          } else {
                            _subscribeToZoom();
                          }
                        },
                        child: _subscribedToZoom
                            ? const Text('Stop zoom')
                            : const Text('Sub to zoom'),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          if (_subscribedToCenterPosition) {
                            _unsubscribeFromPos();
                          } else {
                            _subscribeToPos();
                          }
                        },
                        child: _subscribedToCenterPosition
                            ? const Text("Stop pos")
                            : const Text("Sub to pos"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          if (_subscribedToBounds) {
                            _unsubscribeFromBounds();
                          } else {
                            _subscribeToBounds();
                          }
                        },
                        child: _subscribedToBounds
                            ? const Text("Stop bounds")
                            : const Text("Sub to bounds"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          if (_subscribedToGraphicsInView) {
                            _unSubscribeToGraphicsInView();
                          } else {
                            _subscribeToGraphicsInView();
                          }
                        },
                        child: _subscribedToGraphicsInView
                            ? const Text("Stop printing Graphics")
                            : const Text("Start printing Graphics"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          final graphicIdsInView =
                              _controller?.getVisibleGraphicIds();
                          graphicIdsInView?.forEach(debugPrint);
                        },
                        child: const Text("Print visible Graphics"),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          _addPolygon(
                            layerId: _polyLayerId,
                            graphic: PolygonGraphic(
                              rings: secondPolygon,
                              symbol: redFillSymbol,
                              attributes: Attributes({
                                'id': _polygon2,
                                'name': 'Second Polygon',
                              }),
                              onHover: (isHovered) {
                                isHovered
                                    ? _updateGraphicSymbol(
                                        layerId: _polyLayerId,
                                        graphicId: _polygon2,
                                        symbol: highlightedRedFillSymbol,
                                      )
                                    : _updateGraphicSymbol(
                                        layerId: _polyLayerId,
                                        graphicId: _polygon2,
                                        symbol: redFillSymbol,
                                      );
                                if (_hoveredPolygons[_polygon2] == isHovered) {
                                  return;
                                }
                                _hoveredPolygons[_polygon2] = isHovered;
                              },
                            ),
                          );
                        },
                        child: const Text('Add red polygon'),
                      ),
                      ElevatedButton(
                        onPressed: () => _removeGraphic(
                          layerId: _polyLayerId,
                          objectId: _polygon2,
                        ),
                        child: const Text('Remove red polygon'),
                      ),
                    ],
                  ),
                ),
                if (!kIsWeb)
                  ElevatedButton(
                    onPressed: () => _makePolylineVisible(
                      points: [_firstPinCoordinates, _secondPinCoordinates],
                    ),
                    child: const Text('Zoom to polyline'),
                  ),
                Row(
                  children: [
                    const Text(
                      'Powered by Esri',
                      style: TextStyle(color: Colors.white),
                    ),
                    Text(
                      _attributionText,
                      style: const TextStyle(color: Colors.white),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Marker for searched address
  // final _markerSymbol = const PictureMarkerSymbol(
  //   webUri: 'assets/pin_filled.svg',
  //   mobileUri:
  //       "https://github.com/google/material-design-icons/raw/6ebe181c634f9ced978b526e13db6d7d5cb1c1ba/ios/content/flag/materialiconstwotone/black/twotone_flag_black_48pt.xcassets/twotone_flag_black_48pt.imageset/twotone_flag_black_48pt_3x.png",
  //   width: 56,
  //   height: 56,
  // );

  final _markerSymbol = PictureMarkerSymbol(
    assetUri: 'assets/navPointer.png',
    width: 56,
    height: 56,
  );

  void _routeToVectorLayerMap() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const VectorLayerExamplePage()),
    );
  }

  void _routeToLocationIndicatorExample() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const LocationIndicatorExamplePage()),
    );
  }
}
