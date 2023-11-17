import 'package:sidekick_core/sidekick_core.dart';

class ArcgisMapProject {
  ArcgisMapProject(this.root);

  final Directory root;

  DartPackage get arcgisMap =>
      DartPackage.fromDirectory(root.directory('arcgis_map'))!;

  DartPackage get arcgisMapExample =>
      DartPackage.fromDirectory(root.directory('example'))!;

  DartPackage get arcgisMapPlatformInterface => DartPackage.fromDirectory(
        root.directory('arcgis_map_sdk_platform_interface'),
      )!;

  DartPackage get arcgisMapWeb =>
      DartPackage.fromDirectory(root.directory('arcgis_map_sdk_web'))!;

  DartPackage get arcgisMapAndroid =>
      DartPackage.fromDirectory(root.directory('arcgis_map_android'))!;

  DartPackage get arcgisMapIos =>
      DartPackage.fromDirectory(root.directory('arcgis_map_ios'))!;

  DartPackage get arcgisMapMethodChannel =>
      DartPackage.fromDirectory(root.directory('arcgis_map_sdk_method_channel'))!;

  DartPackage get amSidekickPackage =>
      DartPackage.fromDirectory(root.directory('am_sidekick'))!;

  File get flutterw => root.file('flutterw');

  List<DartPackage>? _packages;

  List<DartPackage> get allPackages {
    return _packages ??= root
        .directory('')
        .listSync()
        .whereType<Directory>()
        .mapNotNull((it) => DartPackage.fromDirectory(it))
        .toList()
      ..add(arcgisMapExample);
  }
}
