import 'package:arcgis/main.dart';
import 'package:arcgis_map/arcgis_map.dart';
import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/material.dart';

class CachingTestPage extends StatefulWidget {
  const CachingTestPage({Key? key}) : super(key: key);

  @override
  State<CachingTestPage> createState() => _CachingTestPageState();
}

class _CachingTestPageState extends State<CachingTestPage> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Center(
              child: Text(
                "If caching is working you should see the content of the map instantly after opening it more then once.",
                textAlign: TextAlign.center,
              ),
            ),
            TextButton(
              onPressed: _openBottomSheet,
              child: const Text("Open bottom sheet"),
            ),
          ],
        ),
      ),
    );
  }

  void _openBottomSheet() {
    _scaffoldKey.currentState!.showBottomSheet(
      (context) => const _MapBottomSheet(),
      constraints: const BoxConstraints(maxHeight: 400),
      enableDrag: false,
    );
  }
}

class _MapBottomSheet extends StatefulWidget {
  const _MapBottomSheet({Key? key}) : super(key: key);

  @override
  State<_MapBottomSheet> createState() => _MapBottomSheetState();
}

class _MapBottomSheetState extends State<_MapBottomSheet> {
  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.topRight,
      children: [
        ArcgisMap(
          apiKey: arcGisApiKey,
          initialCenter: LatLng(51.16, 10.45),
          zoom: 13,
          vectorTileLayerUrls: const [
            "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
          ],
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: FloatingActionButton.small(
            onPressed: () => Navigator.of(context).pop(),
            child: const Icon(Icons.close),
          ),
        ),
      ],
    );
  }
}
