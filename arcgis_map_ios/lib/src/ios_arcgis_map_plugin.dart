import 'package:arcgis_map_method_channel/arcgis_map_method_channel.dart';
import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

class IosArcgisMapPlugin extends MethodChannelArcgisMapPlugin {
  /// Registers the iOS implementation of ArcgisMapPlatform.
  static void registerWith() {
    ArcgisMapPlatform.instance = IosArcgisMapPlugin();
  }

  @override
  Widget buildView({
    required int creationId,
    required PlatformViewCreatedCallback onPlatformViewCreated,
    required ArcgisMapOptions mapOptions,
  }) {
    return UiKitView(
      viewType: MethodChannelArcgisMapPlugin.viewType,
      creationParams: mapOptions.toMap(),
      layoutDirection: TextDirection.ltr,
      creationParamsCodec: const StandardMessageCodec(),
      onPlatformViewCreated: onPlatformViewCreated,
    );
  }
}
