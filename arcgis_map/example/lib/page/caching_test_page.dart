import 'dart:io';

import 'package:arcgis/main.dart';
import 'package:arcgis_map/arcgis_map.dart';
import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';

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
      (context) => _MapBottomSheet(),
      constraints: const BoxConstraints(maxHeight: 400),
      enableDrag: false,
    );
  }
}

class _MapBottomSheet extends StatefulWidget {
  @override
  State<_MapBottomSheet> createState() => _MapBottomSheetState();
}

class _MapBottomSheetState extends State<_MapBottomSheet> {
  static const vectorTileLayerUrl =
      "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer";
  List<String>? _cachedVectorTiles;
  String shownText = "";

  Future<void> onMapCreated(ArcgisMapController controller) async {
    final isAlreadyCached = _cachedVectorTiles!.isNotEmpty;
    if (isAlreadyCached) return;
    await Future.delayed(const Duration(seconds: 2));
    final task = await ExportVectorTilesTask.create(url: vectorTileLayerUrl);
    final areaOfInterest = await controller.getVisibleAreaExtent();
    final vectorTileCachePath = await _getVectorTileCachePath();
    try {
      await task.startExportVectorTilesTaskJob(
        parameters: ExportVectorTilesParameters(
          areaOfInterest: areaOfInterest,
          maxLevel: 16,
        ),
        vectorTileCachePath: vectorTileCachePath,
        onProgressChange: (progress) {
          if (mounted) {
            _updateShownText("Download Progress: $progress%");
          }
          debugPrint('ExportVectorTilesJob $progress');
        },
      );
      if (mounted) {
        _updateShownText("Download Completed");
      }
      debugPrint('ExportVectorTilesJob Completed');
    } catch (e) {
      if (mounted) {
        _updateShownText("Download Failed");
      }
      debugPrint('ExportVectorTilesJob Failed: $e');
    }
  }

  @override
  void initState() {
    super.initState();
    _checkCachedVectorTiles();
  }

  @override
  Widget build(BuildContext context) {
    final cachedVectorTiles = _cachedVectorTiles;
    return Stack(
      alignment: Alignment.topRight,
      children: [
        if (cachedVectorTiles != null)
          ArcgisMap(
            onMapCreated: onMapCreated,
            apiKey: arcGisApiKey,
            initialCenter: LatLng(51.16, 10.45),
            zoom: 13,
            vectorTileLayerUrls: const [vectorTileLayerUrl],
            vectorTileCacheFiles:
                cachedVectorTiles.isEmpty ? null : cachedVectorTiles,
          ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: FloatingActionButton.small(
            onPressed: () => Navigator.of(context).pop(),
            child: const Icon(Icons.close),
          ),
        ),
        Positioned(
          top: 0,
          left: 0,
          child: Container(
            padding: const EdgeInsets.all(4),
            color: Colors.red.withOpacity(.5),
            child: Text(shownText),
          ),
        )
      ],
    );
  }

  static Future<String> _getVectorTileCachePath() async {
    final tempDir = await getTemporaryDirectory();
    return '${tempDir.path}/tileCache.vtpk';
  }

  void _updateShownText(String text) {
    setState(() {
      shownText = text;
    });
  }

  Future<void> _checkCachedVectorTiles() async {
    final vectorTileCachePath = await _getVectorTileCachePath();
    final vectorTileCacheFile = File(vectorTileCachePath);
    final isCached = await vectorTileCacheFile.exists();
    setState(() {
      if (isCached) {
        shownText = "Vector tile is cached";
        _cachedVectorTiles = [vectorTileCacheFile.path];
      } else {
        shownText = "Vector tile is not cached, download starting soon";
        _cachedVectorTiles = [];
      }
    });
  }
}
