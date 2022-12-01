import 'package:arcgis/main.dart';
import 'package:arcgis_map/arcgis_map.dart';
import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class VectorLayerExamplePage extends StatefulWidget {
  const VectorLayerExamplePage({Key? key}) : super(key: key);

  @override
  State<VectorLayerExamplePage> createState() => _VectorLayerExamplePageState();
}

class _VectorLayerExamplePageState extends State<VectorLayerExamplePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          ArcgisMap(
            apiKey: arcGisApiKey,
            initialCenter: LatLng(50, 11),
            zoom: 5,
            vectorTileLayerUrls: const [
              "https://tiles.arcgis.com/tiles/zqDtqVsudQMK98uQ/arcgis/rest/services/TCB_Vektorkarte/VectorTileServer",
            ],
          ),
        ],
      ),
    );
  }
}
