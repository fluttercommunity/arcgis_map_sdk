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
  static const vectorTileLayerUrl =
      "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer";

  final _scaffoldKey = GlobalKey<ScaffoldState>();

  File? _cacheFile;
  int? _fileSize;
  var _mapKey = const Key("map");
  ArcgisMapController? controller;

  double? _progress;
  Object? _exception;
  var _isDownloading = false;

  ExportVectorTilesTask? _task;

  var _cacheDataOnly = false;

  @override
  void initState() {
    _refreshCacheStatus();
    super.initState();
  }

  @override
  void dispose() {
    _task?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(title: const Text("Cache example")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                if (_cacheFile != null && _fileSize != null) ...[
                  const SizedBox(height: 12),
                  Expanded(
                    child: Text(
                      "File size: ${(_fileSize! / 1024 / 1024).toStringAsFixed(2)} mb",
                    ),
                  ),
                  IconButton(
                    onPressed: _deleteCache,
                    icon: const Icon(Icons.delete),
                  ),
                ] else
                  const Text("No cache to read."),
              ],
            ),
            Text(_generateJobStatus()),
            if (_cacheFile != null)
              Row(
                children: [
                  const Text("Only show cache tiles"),
                  Switch.adaptive(
                    value: _cacheDataOnly,
                    onChanged: (newValue) {
                      setState(() {
                        _cacheDataOnly = newValue;
                        _mapKey =
                            Key("${DateTime.now().millisecondsSinceEpoch}");
                      });
                    },
                  ),
                ],
              ),
            TextButton(
              onPressed: _download,
              child: const Text("Start download"),
            ),
            TextButton(
              onPressed: () {
                setState(() {
                  _mapKey = Key("${DateTime.now().millisecondsSinceEpoch}");
                });
              },
              child: const Text("Recreate map"),
            ),
            Expanded(
              child: ArcgisMap(
                key: _mapKey,
                onMapCreated: (c) => controller = c,
                apiKey: arcGisApiKey,
                initialCenter: LatLng(51.16, 10.45),
                zoom: 15,
                vectorTileLayerUrls: [
                  if (!_cacheDataOnly) vectorTileLayerUrl,
                ],
                vectorTileCacheFiles: [
                  if (_cacheFile != null) _cacheFile!.path,
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _refreshCacheStatus() async {
    final cacheFile = File(await _getVectorTileCachePath());

    if (!cacheFile.existsSync() && mounted) {
      setState(() {
        _fileSize = null;
        _cacheFile = null;
      });
      return;
    }

    final fileSize = await cacheFile.length();
    if (!mounted) return;

    setState(() {
      _fileSize = fileSize;
      _cacheFile = cacheFile;
    });
  }

  Future<void> _deleteCache() async {
    final cacheFile = File(await _getVectorTileCachePath());
    await cacheFile.delete();
    await _refreshCacheStatus();
  }

  Future<void> _download() async {
    if (_isDownloading) return;

    final controller = this.controller;
    if (controller == null) return;
    await _task?.cancel();

    _task = await ExportVectorTilesTask.create(url: vectorTileLayerUrl);
    final areaOfInterest = await controller.getVisibleAreaExtent();
    final vectorTileCachePath = await _getVectorTileCachePath();

    if (!mounted) return;
    setState(() {
      _exception = null;
      _progress = null;
      _isDownloading = true;
    });

    try {
      await _task!.start(
        parameters: ExportVectorTilesParameters(
          areaOfInterest: areaOfInterest,
          maxLevel: 23,
        ),
        vectorTileCachePath: vectorTileCachePath,
        onProgressChange: (progress) {
          if (!mounted) return;
          setState(() => _progress = progress);
        },
      );
      debugPrint("Download done.");
      await _refreshCacheStatus();
    } catch (e) {
      debugPrint("failed: $e");
      if (!mounted) return;
      setState(() => _exception = e);
    }

    if (!mounted) return;
    setState(() => _isDownloading = false);
  }

  String _generateJobStatus() {
    if (_exception != null) {
      return "Download failed.: $_exception";
    }
    if (_progress != null && _progress! < 100) {
      return "Downloading... $_progress%";
    }

    return "";
  }

  Future<String> _getVectorTileCachePath() async {
    final tempDir = await getTemporaryDirectory();
    return '${tempDir.path}/tileCache.vtpk';
  }
}
