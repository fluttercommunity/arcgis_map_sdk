import 'dart:typed_data';

import 'package:arcgis_example/main.dart';
import 'package:arcgis_map_sdk/arcgis_map_sdk.dart';
import 'package:flutter/material.dart';

class ExportImageExamplePage extends StatefulWidget {
  const ExportImageExamplePage({super.key});

  @override
  State<ExportImageExamplePage> createState() => _ExportImageExamplePageState();
}

class _ExportImageExamplePageState extends State<ExportImageExamplePage> {
  final _snackBarKey = GlobalKey<ScaffoldState>();
  ArcgisMapController? _controller;

  Uint8List? _imageBytes;
  final initialCenter = const LatLng(51.16, 10.45);
  late final start = initialCenter;
  final end = const LatLng(51.16551, 10.45221);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _snackBarKey,
      appBar: AppBar(),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.refresh),
        onPressed: () async {
          try {
            final image = await _controller!.exportImage();
            if (!mounted) return;
            setState(() => _imageBytes = image);
          } catch (e, stack) {
            if (!mounted) return;
            ScaffoldMessenger.of(_snackBarKey.currentContext!)
                .showSnackBar(SnackBar(content: Text("$e")));
            debugPrint("$e");
            debugPrintStack(stackTrace: stack);
          }
        },
      ),
      body: Column(
        children: [
          Expanded(
            child: ArcgisMap(
              apiKey: arcGisApiKey,
              initialCenter: initialCenter,
              zoom: 12,
              basemap: BaseMap.arcgisNavigationNight,
              mapStyle: MapStyle.twoD,
              onMapCreated: (controller) {
                _controller = controller;

                controller.addGraphic(
                  layerId: "pin",
                  graphic: PointGraphic(
                    longitude: initialCenter.longitude,
                    latitude: initialCenter.latitude,
                    height: 20,
                    attributes: Attributes({
                      'id': "pin1",
                      'name': "pin1",
                      'family': 'Pins',
                    }),
                    symbol: PictureMarkerSymbol(
                      assetUri: 'assets/navPointer.png',
                      width: 56,
                      height: 56,
                    ),
                  ),
                );

                controller.addGraphic(
                  layerId: "line",
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
                    attributes: Attributes({'id': "line-1", 'name': "line-1"}),
                  ),
                );
              },
            ),
          ),
          const Divider(),
          Text(
            _imageBytes == null
                ? "Press the button to generate an image"
                : "This image is a screenshot of the mapview! ⬇️",
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 8),
          Expanded(
            child: _imageBytes == null
                ? SizedBox()
                : Container(
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Image.memory(_imageBytes!),
                  ),
          ),
          SizedBox(height: MediaQuery.paddingOf(context).bottom),
        ],
      ),
    );
  }
}
