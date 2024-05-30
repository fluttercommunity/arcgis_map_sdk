import 'package:arcgis_example/main.dart';
import 'package:arcgis_map_sdk/arcgis_map_sdk.dart';
import 'package:flutter/material.dart';

class VectorLayerExamplePage extends StatefulWidget {
  const VectorLayerExamplePage({super.key});

  @override
  State<VectorLayerExamplePage> createState() => _VectorLayerExamplePageState();
}

class _VectorLayerExamplePageState extends State<VectorLayerExamplePage> {
  bool _isAttributionTextVisible = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Stack(
        alignment: Alignment.bottomLeft,
        children: [
          ArcgisMap(
            apiKey: arcGisApiKey,
            initialCenter: const LatLng(51.16, 10.45),
            zoom: 13,
            vectorTileLayerUrls: const [
              "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
            ],
            mapStyle: MapStyle.twoD,
            isAttributionTextVisible: _isAttributionTextVisible,
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton(
              onPressed: () {
                setState(() {
                  _isAttributionTextVisible = !_isAttributionTextVisible;
                });
              },
              child: Text("Toggle isAttributionTextVisible"),
            ),
          ),
        ],
      ),
    );
  }
}
