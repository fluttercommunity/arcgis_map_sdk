// This counter is used to provide a stable "constant" initialization id
// to the buildView function, so the web implementation can use it as a
// cache key. This needs to be provided from the outside, because web
// views seem to re-render much more often that mobile platform views.
import 'dart:async';
import 'dart:io';

import 'package:arcgis_map/src/arcgis_map_controller.dart';
import 'package:arcgis_map_android/arcgis_map_android.dart';
import 'package:arcgis_map_ios/arcgis_map_ios.dart';
import 'package:arcgis_map_platform_interface/src/method_channel_arcgis_map_plugin.dart';
import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

int _nextMapCreationId = 0;

class ArcgisMap extends StatefulWidget {
  const ArcgisMap({
    required this.apiKey,
    required this.basemap,
    required this.initialCenter,
    required this.zoom,
    this.hideDefaultZoomButtons = false,
    this.hideAttribution = false,
    this.isInteractive = true,
    this.padding = const ViewPadding(),
    this.rotationEnabled = false,
    this.minZoom = 2,
    this.maxZoom = 22,
    this.xMin = -90,
    this.xMax = 90,
    this.yMin = -66,
    this.yMax = 66,
    this.onMapCreated,
    Key? key,
  }) : super(key: key);

  final String apiKey;
  final BaseMap basemap;
  final LatLng initialCenter;
  final bool isInteractive;
  final double zoom;
  final bool hideDefaultZoomButtons;
  final bool hideAttribution;
  final ViewPadding padding;
  final bool rotationEnabled;
  final int minZoom;
  final int maxZoom;
  final double xMin;
  final double xMax;
  final double yMin;
  final double yMax;

  final void Function(ArcgisMapController controller)? onMapCreated;

  @override
  _ArcgisMapState createState() => _ArcgisMapState();
}

class _ArcgisMapState extends State<ArcgisMap> {
  final int _mapId = _nextMapCreationId++;
  late ArcgisMapController controller;

  late ArcgisMapOptions _arcgisMapOptions = ArcgisMapOptions(
    apiKey: widget.apiKey,
    basemap: widget.basemap,
    initialCenter: widget.initialCenter,
    isInteractive: widget.isInteractive,
    zoom: widget.zoom,
    hideDefaultZoomButtons: widget.hideDefaultZoomButtons,
    hideAttribution: widget.hideAttribution,
    padding: widget.padding,
    rotationEnabled: widget.rotationEnabled,
    minZoom: widget.minZoom,
    maxZoom: widget.maxZoom,
    xMin: widget.xMin,
    xMax: widget.xMax,
    yMin: widget.yMin,
    yMax: widget.yMax,
  );

  Future<void> onPlatformViewCreated(int id) async {
    controller = await ArcgisMapController.init(id);
    widget.onMapCreated?.call(controller);
  }

  @override
  void initState() {
    super.initState();

    if (kIsWeb) {
      return;
    } else if (Platform.isIOS) {
      ArcgisMapPlatform.instance = IosArcgisMapPlugin();
    } else if (Platform.isAndroid) {
      ArcgisMapPlatform.instance = AndroidArcgisMapPlugin();
    } else {
      throw UnimplementedError("Platform not implemented yet.");
    }
  }

  @override
  void didUpdateWidget(ArcgisMap oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.basemap != widget.basemap) {
      controller.toggleBaseMap(baseMap: widget.basemap);
    }
    _arcgisMapOptions = ArcgisMapOptions(
      apiKey: widget.apiKey,
      basemap: widget.basemap,
      initialCenter: widget.initialCenter,
      isInteractive: widget.isInteractive,
      zoom: widget.zoom,
      hideDefaultZoomButtons: widget.hideDefaultZoomButtons,
      hideAttribution: widget.hideAttribution,
      padding: widget.padding,
      rotationEnabled: widget.rotationEnabled,
      minZoom: widget.minZoom,
      maxZoom: widget.maxZoom,
      xMin: widget.xMin,
      xMax: widget.xMax,
      yMin: widget.yMin,
      yMax: widget.yMax,
    );
  }

  @override
  Widget build(BuildContext context) {
    return ArcgisMapPlatform.instance.buildView(
      creationId: _mapId,
      onPlatformViewCreated: onPlatformViewCreated,
      mapOptions: _arcgisMapOptions,
    );
  }
}
