import 'dart:async';
import 'dart:core';

import 'package:arcgis_example/basemap_style_example_page.dart';
import 'package:arcgis_example/draw_on_map_example_page.dart';
import 'package:arcgis_example/export_image_example_page.dart';
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
  /// null when executed on a platform that's not supported yet
  ArcgisMapController? _controller;

  StreamSubscription<BoundingBox>? _boundingBoxSubscription;
  StreamSubscription<LatLng>? _centerPositionSubscription;
  StreamSubscription<String>? _attributionTextSubscription;
  StreamSubscription<double>? _zoomSubscription;
  String _attributionText = '';
  bool _subscribedToBounds = false;

  bool _subscribedToCenterPosition = false;
  bool _subscribedToZoom = false;

  bool show3dMap = false;
  final initialCenter = const LatLng(51.16, 10.45);
  final tappedHQ = const LatLng(48.1234963, 11.5910182);
  var _isInteractionEnabled = true;

  VoidCallback? _removeStatusListener;

  final _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void dispose() {
    _boundingBoxSubscription?.cancel();
    _centerPositionSubscription?.cancel();
    _attributionTextSubscription?.cancel();
    _zoomSubscription?.cancel();
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

      _attributionTextSubscription =
          _controller?.attributionText().listen((attribution) {
        setState(() {
          _attributionText = attribution;
        });
      });

      // Create basic 3D Layer with elevation and 3D buildings
      await _createSceneLayer();
    }
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

  @override
  Widget build(BuildContext context) {
    final isLargeScreen = MediaQuery.sizeOf(context).width > 800;
    return Scaffold(
      key: _scaffoldKey,
      drawer: isLargeScreen
          ? null
          : NavigationDrawer(children: _buildTiles(context)),
      body: Row(
        children: [
          SizedBox(
            width: 250,
            child: ListView(
              children: _buildTiles(context),
            ),
          ),
          Expanded(
            child: Stack(
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
                                          show3dMap
                                              ? MapStyle.threeD
                                              : MapStyle.twoD,
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
                                  _isInteractionEnabled =
                                      !_isInteractionEnabled;
                                });
                              },
                              child: Text(
                                "${_isInteractionEnabled ? "Disable" : "Enable"} Interaction",
                              ),
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
                            if (kIsWeb)
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
                              onPressed: () => _controller?.retryLoad(),
                              child: const Text('Reload map'),
                            ),
                          ],
                        ),
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
                if (!isLargeScreen)
                  Positioned(
                    top: 8 + MediaQuery.paddingOf(context).top,
                    left: 8,
                    child: IconButton(
                      onPressed: () {
                        _scaffoldKey.currentState!.openDrawer();
                      },
                      color: Colors.black,
                      style: ButtonStyle(
                        backgroundColor: WidgetStatePropertyAll(
                            Colors.grey.withValues(alpha: 0.5)),
                      ),
                      icon: Icon(Icons.menu),
                    ),
                  )
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

  List<Widget> _buildTiles(BuildContext context) {
    return [
      _buildTile(
        title: "Vector Layer Example",
        onTap: () {
          _navigateTo(context, VectorLayerExamplePage());
        },
      ),
      _buildTile(
        title: "Export Image Example",
        onTap: () {
          _navigateTo(context, ExportImageExamplePage());
        },
      ),
      _buildTile(
        title: "Location Indicator Example",
        onTap: () {
          _navigateTo(context, LocationIndicatorExamplePage());
        },
      ),
      _buildTile(
        title: "Basemap Style Example",
        onTap: () {
          _navigateTo(context, BasemapStyleExamplePage());
        },
      ),
      _buildTile(
        title: "Draw on map Example",
        onTap: () {
          _navigateTo(context, DrawOnMapExamplePage());
        },
      ),
    ];
  }

  Widget _buildTile({
    required String title,
    required VoidCallback onTap,
  }) {
    return Column(
      children: [
        ListTile(
          onTap: onTap,
          title: Text(
            title,
            style: TextStyle(fontSize: 14, color: Colors.deepPurple),
          ),
        ),
        Divider(height: 1),
      ],
    );
  }

  void _navigateTo(BuildContext context, Widget page) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => page),
    );
  }
}
