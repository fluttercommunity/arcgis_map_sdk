import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

class AndroidArcgisMapPlugin extends MethodChannelArcgisMapPlugin {
  @override
  Widget buildView({
    required int creationId,
    required PlatformViewCreatedCallback onPlatformViewCreated,
    required ArcgisMapOptions mapOptions,
  }) {
    return AndroidView(
      viewType: MethodChannelArcgisMapPlugin.viewType,
      creationParams: mapOptions.toMap(),
      creationParamsCodec: const StandardMessageCodec(),
    );
  }
}
