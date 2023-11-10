import 'package:arcgis/main.dart';
import 'package:arcgis_map/arcgis_map.dart';
import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/material.dart';

class VectorLayerExamplePage extends StatefulWidget {
  const VectorLayerExamplePage({super.key});

  @override
  State<VectorLayerExamplePage> createState() => _VectorLayerExamplePageState();
}

class _VectorLayerExamplePageState extends State<VectorLayerExamplePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Stack(
        children: [
          ArcgisMap(
            apiKey: arcGisApiKey,
            initialCenter: LatLng(51.16, 10.45),
            zoom: 13,
            vectorTileLayerUrls: const [
              "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
            ],
            mapStyle: MapStyle.twoD,
          ),
        ],
      ),
    );
  }
}
