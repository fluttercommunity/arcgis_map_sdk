import 'package:arcgis_example/main.dart';
import 'package:arcgis_map_sdk/arcgis_map_sdk.dart';
import 'package:flutter/material.dart';

class VectorLayerExamplePage extends StatefulWidget {
  const VectorLayerExamplePage({super.key});

  @override
  State<VectorLayerExamplePage> createState() => _VectorLayerExamplePageState();
}

class _VectorLayerExamplePageState extends State<VectorLayerExamplePage> {
  ArcgisMapController? _controller;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.refresh),
        onPressed: () => _controller?.reload(),
      ),
      body: ArcgisMap(
        apiKey: arcGisApiKey,
        onMapCreated: (controller) {
          _controller = controller;
        },
        initialCenter: const LatLng(51.16, 10.45),
        zoom: 13,
        vectorTileLayerUrls: const [
          "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
        ],
        mapStyle: MapStyle.twoD,
      ),
    );
  }
}
