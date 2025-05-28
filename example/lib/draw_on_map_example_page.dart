import 'dart:async';

import 'package:arcgis_example/main.dart';
import 'package:arcgis_example/map_elements.dart';
import 'package:arcgis_example/pointer_interceptor_web.dart';
import 'package:arcgis_map_sdk/arcgis_map_sdk.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class DrawOnMapExamplePage extends StatefulWidget {
  const DrawOnMapExamplePage({super.key});

  @override
  State<DrawOnMapExamplePage> createState() => _DrawOnMapExamplePageState();
}

class _DrawOnMapExamplePageState extends State<DrawOnMapExamplePage> {
  static const String _pinId1 = '123';
  final LatLng _firstPinCoordinates = const LatLng(52.9, 13.2);
  static const String _pinId2 = '456';
  final LatLng _secondPinCoordinates = const LatLng(51, 11);
  static const String _pinFeatureId = '789';
  final LatLng _pinFeatureCoordinates = const LatLng(50.945, 6.965);
  static const String _pinLayerId = 'PinLayer';
  static const String _featureLayerId = 'FeatureLayer';
  static const String _polygon1 = 'polygon1';
  static const String _polygon2 = 'polygon2';
  static const String _polyLayerId = 'PolygonLayer';
  static const String _lineLayerId = 'LinesGraphics';

  /// null when executed on a platform that's not supported yet
  ArcgisMapController? _controller;
  bool show3dMap = false;
  final initialCenter = const LatLng(51.16, 10.45);
  final tappedHQ = const LatLng(48.1234963, 11.5910182);

  VoidCallback? _removeStatusListener;

  final _scaffoldKey = GlobalKey<ScaffoldState>();

  bool _isFirstPinInView = false;
  bool _isSecondPinInView = false;
  bool _isFeatureInView = false;

  bool _subscribedToGraphicsInView = false;

  final Map<String, bool> _hoveredPolygons = {};
  StreamSubscription<bool>? _isGraphicHoveredSubscription;
  StreamSubscription<List<String>>? _graphicsInViewSubscription;

  final _markerSymbol = PictureMarkerSymbol(
    assetUri: 'assets/navPointer.png',
    width: 56,
    height: 56,
  );

  @override
  void dispose() {
    _isGraphicHoveredSubscription?.cancel();
    _graphicsInViewSubscription?.cancel();
    _removeStatusListener?.call();
    super.dispose();
  }

  Future<void> _onMapCreated(ArcgisMapController controller) async {
    _controller = controller;

    _removeStatusListener =
        _controller!.addStatusChangeListener(_onMapStatusChanged);

    // TODO: Remove when mobile implementation is complete
    if (kIsWeb) {
      _controller?.onClickListener().listen((Attributes? attributes) {
        if (attributes == null || !mounted) return;
        final snackBar = SnackBar(
          content:
              Text('Attributes Id after on Click: ${attributes.data['name']}'),
        );
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(snackBar);
      });

      // Create GraphicsLayer with Polygons
      await _createGraphicLayer(
        layerId: _polyLayerId,
        elevationMode: ElevationMode.onTheGround,
      );

      await _createFeatureLayer(
        layerId: _featureLayerId,
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      floatingActionButton: FloatingActionButton(onPressed: _showBottomSheet,child: Icon(Icons.draw),),
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
            top: MediaQuery.paddingOf(context).top + 8,
            left: 8,
            child: BackButton(
              color: Colors.black,
              style: ButtonStyle(
                  backgroundColor: WidgetStatePropertyAll(Colors.grey)),
            ),
          ),
          Positioned(
            bottom: 40,
            right: 0,
            left: 0,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
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
                    if (kIsWeb)
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
                        backgroundColor: show3dMap ? Colors.red : Colors.blue,
                        child: Text(show3dMap ? '3D' : '2D'),
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

  void _onMapStatusChanged(MapStatus status) {
    final scaffoldContext = _scaffoldKey.currentContext;
    if (scaffoldContext == null) return;

    ScaffoldMessenger.of(scaffoldContext).showSnackBar(
      SnackBar(
        content: Text('Map status changed to: $status'),
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void _setMouseCursor(bool isHovered) {
    _controller?.setMouseCursor(
      isHovered ? SystemMouseCursors.click : SystemMouseCursors.basic,
    );
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

  Future<FeatureLayer?> _createFeatureLayer({
    required String layerId,
  }) async {
    final layer = await _controller?.addFeatureLayer(
      layerId: layerId,
      options: FeatureLayerOptions(
        fields: <Field>[
          Field(name: 'oid', type: 'oid'),
          Field(name: 'id', type: 'string'),
          Field(name: 'family', type: 'string'),
          Field(name: 'name', type: 'string'),
        ],
        symbol: _markerSymbol,
      ),
    );
    return layer;
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

  void _showBottomSheet() {
    showModalBottomSheet(
        context: context,
        builder: (context) {
          return PointerInterceptorWeb(
            child: ListView(
              padding: EdgeInsets.only(
                  top: 16,
                  bottom: MediaQuery.paddingOf(context).bottom + 8,
                  right: 16,
                  left: 16),
              children: [
                _buildAction(
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
                  text:
                      _isFirstPinInView ? 'Remove first Pin' : 'Add first Pin',
                ),
                _buildAction(
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
                  text: _isSecondPinInView
                      ? 'Remove second Pin'
                      : 'Add second Pin',
                ),
                _buildAction(
                  onPressed: () {
                    if (_isFeatureInView) {
                      _removeGraphic(
                        layerId: _featureLayerId,
                        objectId: _pinFeatureId,
                      );
                      setState(() {
                        _isFeatureInView = false;
                      });
                    } else {
                      _addPin(
                        layerId: _featureLayerId,
                        objectId: _pinFeatureId,
                        location: _pinFeatureCoordinates,
                      );
                      _controller?.moveCamera(
                        point: _pinFeatureCoordinates,
                        zoomLevel: 15,
                      );
                      setState(() {
                        _isFeatureInView = true;
                      });
                    }
                  },
                  text: _isFeatureInView
                      ? 'Remove FeatureLayer Pin'
                      : 'Add FeatureLayer Pin',
                ),
                if (kIsWeb)
                  _buildAction(
                    onPressed: () {
                      if (_subscribedToGraphicsInView) {
                        _unSubscribeToGraphicsInView();
                      } else {
                        _subscribeToGraphicsInView();
                      }
                    },
                    text: _subscribedToGraphicsInView
                        ? "Stop printing Graphics"
                        : "Start printing Graphics",
                  ),
                if (kIsWeb)
                  _buildAction(
                    onPressed: () {
                      final graphicIdsInView =
                          _controller?.getVisibleGraphicIds();
                      graphicIdsInView?.forEach(debugPrint);
                    },
                    text: "Print visible Graphics",
                  ),
                _buildAction(
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
                  text: 'Add red polygon',
                ),
                _buildAction(
                  onPressed: () => _removeGraphic(
                    layerId: _polyLayerId,
                    objectId: _polygon2,
                  ),
                  text: 'Remove red polygon',
                ),
                _buildAction(
                  onPressed: () => _makePolylineVisible(
                    points: [_firstPinCoordinates, _secondPinCoordinates],
                  ),
                  text: 'Zoom to polyline',
                ),
              ],
            ),
          );
        });
  }

  Widget _buildAction({required VoidCallback onPressed, required String text}) {
    return ListTile(
      onTap: () {
        Navigator.pop(context);
        onPressed();
      },
      title: Text(text,style: TextStyle(color: Colors.deepPurple),),
    );
  }
}
