import 'package:sidekick_core/sidekick_core.dart';

class ArcgisMapProject {
  ArcgisMapProject(this.root);

  final Directory root;

  DartPackage get arcgisMapSdk =>
      DartPackage.fromDirectory(root.directory('arcgis_map_sdk'))!;

  DartPackage get arcgisMapExample =>
      DartPackage.fromDirectory(root.directory('example'))!;

  DartPackage get arcgisMapSdkPlatformInterface => DartPackage.fromDirectory(
        root.directory('arcgis_map_sdk_platform_interface'),
      )!;

  DartPackage get arcgisMapSdkWeb =>
      DartPackage.fromDirectory(root.directory('arcgis_map_sdk_web'))!;

  DartPackage get arcgisMapSdkAndroid =>
      DartPackage.fromDirectory(root.directory('arcgis_map_sdk_android'))!;

  DartPackage get arcgisMapSdkIos =>
      DartPackage.fromDirectory(root.directory('arcgis_map_ios'))!;

  DartPackage get arcgisMapSdkMethodChannel => DartPackage.fromDirectory(
      root.directory('arcgis_map_sdk_method_channel'))!;

  DartPackage get amSidekickPackage =>
      DartPackage.fromDirectory(root.directory('am_sidekick'))!;

  File get flutterw => root.file('flutterw');
}
