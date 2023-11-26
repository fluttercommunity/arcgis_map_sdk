import 'package:arcgis_example/main.dart';
import 'package:arcgis_map_sdk/arcgis_map_sdk.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

class LocationIndicatorExamplePage extends StatefulWidget {
  const LocationIndicatorExamplePage({super.key});

  @override
  State<LocationIndicatorExamplePage> createState() =>
      _LocationIndicatorExamplePageState();
}

class _LocationIndicatorExamplePageState
    extends State<LocationIndicatorExamplePage> {
  final _snackBarKey = GlobalKey<ScaffoldState>();
  ArcgisMapController? _controller;
  bool _isStarted = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _snackBarKey,
      appBar: AppBar(),
      floatingActionButton: FloatingActionButton(
        child: Icon(_isStarted ? Icons.stop : Icons.play_arrow),
        onPressed: () async {
          try {
            _isStarted
                ? await _controller!.locationDisplay.stopSource()
                : await _controller!.locationDisplay.startSource();
          } catch (e, stack) {
            if (!mounted) return;
            ScaffoldMessenger.of(_snackBarKey.currentContext!)
                .showSnackBar(SnackBar(content: Text("$e")));
            debugPrint("$e");
            debugPrintStack(stackTrace: stack);
          }

          if (!mounted) return;
          setState(() => _isStarted = !_isStarted);
        },
      ),
      body: ArcgisMap(
        apiKey: arcGisApiKey,
        initialCenter: const LatLng(51.16, 10.45),
        zoom: 13,
        basemap: BaseMap.arcgisNavigationNight,
        mapStyle: MapStyle.twoD,
        onMapCreated: (controller) {
          _controller = controller;
          _requestLocationPermission();
        },
      ),
    );
  }

  Future<void> _requestLocationPermission() async {
    await Geolocator.requestPermission();
    final location = await Geolocator.getLastKnownPosition();
    if (!mounted || location == null) return;

    await _controller!.moveCamera(
      point: LatLng(location.latitude, location.longitude),
      zoomLevel: 12,
    );
  }
}
