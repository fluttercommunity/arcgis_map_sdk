import 'dart:async';

import 'package:arcgis_example/main.dart';
import 'package:arcgis_example/map_elements.dart';
import 'package:arcgis_example/pointer_interceptor_web.dart';
import 'package:arcgis_map_sdk/arcgis_map_sdk.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class BasemapStyleExamplePage extends StatefulWidget {
  const BasemapStyleExamplePage({super.key});

  @override
  State<BasemapStyleExamplePage> createState() =>
      _BasemapStyleExamplePageState();
}

class _BasemapStyleExamplePageState extends State<BasemapStyleExamplePage> {
  /// null when executed on a platform that's not supported yet
  ArcgisMapController? _controller;
  BaseMap selectedBasemap = BaseMap.values.first;
  var _isSwitchingAllStyles = false;
  bool show3dMap = false;
  final initialCenter = const LatLng(51.16, 10.45);
  final tappedHQ = const LatLng(48.1234963, 11.5910182);

  VoidCallback? _removeStatusListener;

  final _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void dispose() {
    _removeStatusListener?.call();

    super.dispose();
  }

  Future<void> _onMapCreated(ArcgisMapController controller) async {
    _controller = controller;

    _removeStatusListener =
        _controller!.addStatusChangeListener(_onMapStatusChanged);

    // TODO: Remove when mobile implementation is complete
    if (kIsWeb) {
      // Create basic 3D Layer with elevation and 3D buildings
      await _createSceneLayer();
    }
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
    return Scaffold(
      key: _scaffoldKey,
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
                SizedBox(height: 8),
                Center(
                  child: ElevatedButton(
                      onPressed:
                          _isSwitchingAllStyles ? null : _switchAllStyles,
                      child: Text(_isSwitchingAllStyles
                          ? "Switching... ${BaseMap.values.indexOf(selectedBasemap) + 1}/${BaseMap.values.length}"
                          : "Switch through all styles once")),
                ),
                Center(
                  child: ElevatedButton(
                    style: ButtonStyle(
                      shape: WidgetStatePropertyAll(
                        RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
                    onPressed: _isSwitchingAllStyles
                        ? null
                        : () {
                            showModalBottomSheet(
                                context: context,
                                builder: (context) {
                                  return PointerInterceptorWeb(
                                    child: ListView.separated(
                                      padding: EdgeInsets.only(
                                          top: 8,
                                          bottom: MediaQuery.paddingOf(context)
                                                  .bottom +
                                              8),
                                      itemCount: BaseMap.values.length,
                                      separatorBuilder: (_, __) => Padding(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 20),
                                        child: Divider(
                                          height: 1,
                                        ),
                                      ),
                                      itemBuilder: (context, int i) {
                                        final basemap = BaseMap.values[i];
                                        return ListTile(
                                          dense: true,
                                          onTap: () {
                                            Navigator.pop(context);
                                            setState(() {
                                              selectedBasemap = basemap;
                                            });

                                            _controller!.toggleBaseMap(
                                                baseMap: basemap);
                                          },
                                          title: Text(
                                            basemap.name,
                                            style: TextStyle(
                                              color: Theme.of(context)
                                                  .buttonTheme
                                                  .colorScheme!
                                                  .onPrimaryContainer,
                                            ),
                                          ),
                                        );
                                      },
                                    ),
                                  );
                                });
                          },
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          selectedBasemap.name,
                          style: TextStyle(
                            decoration: TextDecoration.underline,
                            fontSize: 15,
                          ),
                        ),
                        SizedBox(width: 8),
                        Icon(
                          Icons.keyboard_arrow_down,
                          size: 22,
                        )
                      ],
                    ),
                  ),
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

  Future<void> _switchAllStyles() async {
    setState(() => _isSwitchingAllStyles = true);
    try {
      for (final baseMap in BaseMap.values) {
        await _controller?.toggleBaseMap(baseMap: baseMap);
        if (!mounted) return;
        setState(() => selectedBasemap = baseMap);
        await Future<void>.delayed(const Duration(seconds: 2));
        if (!mounted) return;
      }
    } finally {
      if (mounted) {
        setState(() => _isSwitchingAllStyles = false);
      }
    }
  }
}
