import 'package:arcgis_map_sdk/src/model/auto_pan_mode.dart';
import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';

/// The use case for manual location displays is relevant when the application
/// has its own location stream obtained from a different source, such as a geolocator,
/// with specific settings.
///
/// Instead of relying on ArcGIS to create a location client that fetches the position
/// again, this use case involves processing the locations retrieved by the application
/// and displaying the exact location processed by the application.
///
/// This approach is beneficial when the application needs to manage its own location data
/// independently, without relying on additional calls to fetch the location.
class ArcgisManualLocationDisplay extends ArcgisLocationDisplay {
  @override
  String get type => "manual";

  ArcgisManualLocationDisplay({super.mapId});

  Future<void> updateLocation(UserPosition position) {
    _assertAttached();
    return ArcgisMapPlatform.instance
        .updateLocationDisplaySourcePositionManually(
      _mapId!,
      position,
    );
  }
}

class ArcgisLocationDisplay {
  int? _mapId;
  final String type = "system";

  ArcgisLocationDisplay({int? mapId}) : _mapId = mapId;

  // ignore: use_setters_to_change_properties
  void attachToMap(int mapId) => _mapId = mapId;

  void deattachFromMap() => _mapId = null;

  Future<void> startSource() {
    _assertAttached();
    return ArcgisMapPlatform.instance.startLocationDisplayDataSource(_mapId!);
  }

  Future<void> stopSource() {
    _assertAttached();
    return ArcgisMapPlatform.instance.stopLocationDisplayDataSource(_mapId!);
  }

  void setAutoPanMode(AutoPanMode autoPanMode) {
    _assertAttached();
    return ArcgisMapPlatform.instance.setAutoPanMode(autoPanMode.name, _mapId!);
  }

  Future<void> setDefaultSymbol(Symbol symbol) {
    _assertAttached();
    return ArcgisMapPlatform.instance
        .setLocationDisplayDefaultSymbol(_mapId!, symbol);
  }

  Future<void> setAccuracySymbol(Symbol symbol) {
    _assertAttached();
    return ArcgisMapPlatform.instance
        .setLocationDisplayAccuracySymbol(_mapId!, symbol);
  }

  Future<void> setPingAnimationSymbol(Symbol symbol) {
    _assertAttached();
    return ArcgisMapPlatform.instance
        .setLocationDisplayPingAnimationSymbol(_mapId!, symbol);
  }

  Future<void> setUseCourseSymbolOnMovement(bool useCourseSymbol) {
    _assertAttached();
    return ArcgisMapPlatform.instance
        .setUseCourseSymbolOnMovement(_mapId!, useCourseSymbol);
  }

  void _assertAttached() {
    assert(
      _mapId != null,
      "LocationDisplay has not been attached to any map. Make sure to call ArcgisMapController.setLocationDisplay.",
    );
  }
}
