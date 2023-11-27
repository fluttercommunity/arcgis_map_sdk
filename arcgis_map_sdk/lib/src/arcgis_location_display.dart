import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';

class ArcgisManualLocationDisplay extends ArcgisLocationDisplay {
  @override
  String get type => "manual";

  ArcgisManualLocationDisplay(super.mapId);

  Future<void> updateLocation(UserPosition position) {
    return ArcgisMapPlatform.instance
        .updateLocationDisplaySourcePositionManually(
      mapId,
      position,
    );
  }
}

class ArcgisLocationDisplay {
  final int mapId;
  final String type = "system";

  ArcgisLocationDisplay(this.mapId);

  Future<void> startSource() {
    return ArcgisMapPlatform.instance.startLocationDisplayDataSource(mapId);
  }

  Future<void> stopSource() {
    return ArcgisMapPlatform.instance.stopLocationDisplayDataSource(mapId);
  }

  Future<void> setDataSource() {
    return ArcgisMapPlatform.instance.setLocationDisplayDataSource(mapId);
  }

  Future<void> setDefaultSymbol(Symbol symbol) {
    return ArcgisMapPlatform.instance
        .setLocationDisplayDefaultSymbol(mapId, symbol);
  }

  Future<void> setAccuracySymbol(Symbol symbol) {
    return ArcgisMapPlatform.instance
        .setLocationDisplayAccuracySymbol(mapId, symbol);
  }

  Future<void> setPingAnimationSymbol(Symbol symbol) {
    return ArcgisMapPlatform.instance
        .setLocationDisplayPingAnimationSymbol(mapId, symbol);
  }

  Future<void> setUseCourseSymbolOnMovement(bool useCourseSymbol) {
    return ArcgisMapPlatform.instance
        .setUseCourseSymbolOnMovement(mapId, useCourseSymbol);
  }
}
