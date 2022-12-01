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
      appBar: AppBar(),
      body: Stack(
        children: [
          ArcgisMap(
            apiKey: arcGisApiKey,
            initialCenter: LatLng(-8, -120),
            zoom: 13,
            vectorTileLayerUrls: const [
              "https://vectortileservices3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_Mountains_Parcels_VTL/VectorTileServer/",
            ],
          ),
        ],
      ),
    );
  }
}
