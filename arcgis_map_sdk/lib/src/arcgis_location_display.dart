import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';
import 'package:flutter/cupertino.dart';

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

  Future<void> setDataSource() {
    _assertAttached();
    return ArcgisMapPlatform.instance.setLocationDisplayDataSource(_mapId!);
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
