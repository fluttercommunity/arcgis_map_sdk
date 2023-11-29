import 'dart:math';

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
  final _mockLocations = [
    LatLng(48.1234963, 11.5910182),
    LatLng(48.1239241, 11.45897063),
    LatLng(48.123876, 11.590120),
    LatLng(48.123876, 11.590120),
    LatLng(48.123740, 11.589015),
    LatLng(48.123164, 11.588585),
    LatLng(48.1234963, 11.5910182),
  ];

  final _snackBarKey = GlobalKey<ScaffoldState>();
  ArcgisMapController? _controller;
  bool _isStarted = false;
  bool _useCourseSymbolForMovement = false;
  bool _isManualLocationSource = false;

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
      body: Column(
        children: [
          Expanded(
            child: ArcgisMap(
              apiKey: arcGisApiKey,
              initialCenter: const LatLng(51.16, 10.45),
              zoom: 13,
              basemap: BaseMap.arcgisNavigationNight,
              mapStyle: MapStyle.twoD,
              onMapCreated: (controller) {
                _controller = controller;
                _requestLocationPermission();
                _configureLocationDisplay(Colors.blue);
              },
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _switchLocationSource,
            child: Text(
              _isManualLocationSource
                  ? "Use auto location source"
                  : "Use manual location source",
            ),
          ),
          if (_isManualLocationSource) ...[
            ElevatedButton(
              onPressed: _simulateLocationChange,
              child: Text("simulate location change"),
            ),
          ],
          ElevatedButton(
            onPressed: () => _configureLocationDisplay(Colors.green),
            child: Text("tint indicator green"),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: () => _configureLocationDisplay(Colors.red),
            child: Text("tint indicator red"),
          ),
          ElevatedButton(
            onPressed: () {
              setState(
                () =>
                    _useCourseSymbolForMovement = !_useCourseSymbolForMovement,
              );
              _configureLocationDisplay(Colors.red);
            },
            child: Text(
              _useCourseSymbolForMovement
                  ? "Disable course indicator"
                  : "Enable course indicator",
            ),
          ),
          SizedBox(height: MediaQuery.paddingOf(context).bottom),
        ],
      ),
    );
  }

  Future<void> _requestLocationPermission() async {
    await Geolocator.requestPermission();
    final location = await Geolocator.getLastKnownPosition();
    if (!mounted || location == null) return;

    await _controller!.moveCamera(
      point: LatLng(location.latitude, location.longitude),
      zoomLevel: 16,
    );
  }

  Future<void> _configureLocationDisplay(MaterialColor color) async {
    await _controller!.locationDisplay.setUseCourseSymbolOnMovement(
      _useCourseSymbolForMovement,
    );
    await _controller!.locationDisplay.setDefaultSymbol(
      SimpleMarkerSymbol(
        color: color.shade100,
        outlineColor: color.shade500,
        radius: 24,
      ),
    );
    await _controller!.locationDisplay.setPingAnimationSymbol(
      SimpleMarkerSymbol(
        color: color.shade50,
        outlineColor: color.shade900,
      ),
    );
    await _controller!.locationDisplay.setAccuracySymbol(
      SimpleLineSymbol(color: color.shade800, width: 3),
    );
  }

  Future<void> _switchLocationSource() async {
    await _controller!.locationDisplay.stopSource();
    await _controller!.setLocationDisplay(
      _isManualLocationSource
          ? ArcgisLocationDisplay()
          : ArcgisManualLocationDisplay(),
    );
    setState(() => _isManualLocationSource = !_isManualLocationSource);

    if (!_isManualLocationSource) {
      final location = await Geolocator.getLastKnownPosition();
      if (location == null) return;
      await _controller!.moveCamera(
        point: LatLng(location.latitude, location.longitude),
      );
    }
  }

  Future<void> _simulateLocationChange() async {
    final display = _controller!.locationDisplay as ArcgisManualLocationDisplay;

    await _controller!.moveCamera(point: _mockLocations.first);
    for (final latLng in _mockLocations) {
      if (!mounted) break;
      if (!_isManualLocationSource) break;

      await display.updateLocation(
        UserPosition(
          latLng: latLng,
          accuracy: Random().nextInt(100).toDouble(),
          velocity: Random().nextInt(100).toDouble(),
        ),
      );
      await Future<void>.delayed(const Duration(milliseconds: 600));
    }
  }
}
