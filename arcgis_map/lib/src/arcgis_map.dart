// This counter is used to provide a stable "constant" initialization id
// to the buildView function, so the web implementation can use it as a
// cache key. This needs to be provided from the outside, because web
// views seem to re-render much more often that mobile platform views.
import 'dart:async';
import 'dart:io';

import 'package:arcgis_map/src/arcgis_map_controller.dart';
import 'package:arcgis_map_sdk_android/arcgis_map_sdk_android.dart';
import 'package:arcgis_map_sdk_ios/arcgis_map_sdk_ios.dart';
import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

int _nextMapCreationId = 0;

class ArcgisMap extends StatefulWidget {
  const ArcgisMap({
    required this.apiKey,
    required this.initialCenter,
    required this.zoom,
    required this.mapStyle,
    this.basemap,
    this.showLabelsBeneathGraphics = false,
    this.defaultUiList = const [],
    this.isPopupEnabled = false,
    this.ground,
    this.isInteractive = true,
    this.padding = const ViewPadding(),
    this.rotationEnabled = false,
    this.tilt = 0,
    this.initialHeight = 5000,
    this.heading = 0,
    this.minZoom = 2,
    this.maxZoom = 22,
    this.xMin = -90,
    this.xMax = 90,
    this.yMin = -66,
    this.yMax = 66,
    this.onMapCreated,
    this.vectorTileLayerUrls,
    super.key,
  }) : assert(
          basemap != null ||
              (vectorTileLayerUrls != null && (vectorTileLayerUrls.length > 0)),
        );

  final String apiKey;
  final BaseMap? basemap;
  final List<DefaultWidget> defaultUiList;
  final bool isPopupEnabled;
  final MapStyle mapStyle;
  final Ground? ground;
  final LatLng initialCenter;

  /// If true, the basemap labels will be moved to the background. Behind any graphics.
  final bool showLabelsBeneathGraphics;
  final bool isInteractive;
  final double zoom;
  final double tilt;
  final double initialHeight;
  final double heading;
  final ViewPadding padding;
  final bool rotationEnabled;
  final int minZoom;
  final int maxZoom;
  final double xMin;
  final double xMax;
  final double yMin;
  final double yMax;

  /// Adds vector tile layers to the map. You can add more than one.
  /// When the [vectorTileLayerUrls] is not empty, the [basemap] field
  /// is ignored.
  final List<String>? vectorTileLayerUrls;

  final void Function(ArcgisMapController controller)? onMapCreated;

  @override
  State<ArcgisMap> createState() => _ArcgisMapState();
}

class _ArcgisMapState extends State<ArcgisMap> {
  final int _mapId = _nextMapCreationId++;
  late ArcgisMapController controller;

  late ArcgisMapOptions _arcgisMapOptions = ArcgisMapOptions(
    apiKey: widget.apiKey,
    mapStyle: widget.mapStyle,
    basemap: widget.basemap,
    ground: widget.ground,
    initialCenter: widget.initialCenter,
    showLabelsBeneathGraphics: widget.showLabelsBeneathGraphics,
    isInteractive: widget.isInteractive,
    zoom: widget.zoom,
    heading: widget.heading,
    initialHeight: widget.initialHeight,
    tilt: widget.tilt,
    defaultUiList: widget.defaultUiList,
    isPopupEnabled: widget.isPopupEnabled,
    padding: widget.padding,
    rotationEnabled: widget.rotationEnabled,
    minZoom: widget.minZoom,
    maxZoom: widget.maxZoom,
    xMin: widget.xMin,
    xMax: widget.xMax,
    yMin: widget.yMin,
    yMax: widget.yMax,
    vectorTilesUrls: widget.vectorTileLayerUrls,
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
    if ((widget.basemap != null) && oldWidget.basemap != widget.basemap) {
      controller.toggleBaseMap(baseMap: widget.basemap!);
    }
    _arcgisMapOptions = ArcgisMapOptions(
      apiKey: widget.apiKey,
      mapStyle: widget.mapStyle,
      basemap: widget.basemap,
      ground: widget.ground,
      initialCenter: widget.initialCenter,
      showLabelsBeneathGraphics: widget.showLabelsBeneathGraphics,
      isInteractive: widget.isInteractive,
      zoom: widget.zoom,
      heading: widget.heading,
      initialHeight: widget.initialHeight,
      tilt: widget.tilt,
      padding: widget.padding,
      rotationEnabled: widget.rotationEnabled,
      minZoom: widget.minZoom,
      maxZoom: widget.maxZoom,
      xMin: widget.xMin,
      xMax: widget.xMax,
      yMin: widget.yMin,
      yMax: widget.yMax,
      vectorTilesUrls: widget.vectorTileLayerUrls,
      defaultUiList: widget.defaultUiList,
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
