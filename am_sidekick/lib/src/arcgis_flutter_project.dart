import 'package:sidekick_core/sidekick_core.dart';

class ArcgisFlutterProject {
  ArcgisFlutterProject(this.root);

  final Directory root;

  DartPackage get arcgisMap =>
      DartPackage.fromDirectory(root.directory('arcgis_map'))!;

  DartPackage get arcgisMapExample =>
      DartPackage.fromDirectory(root.directory('arcgis_map/example'))!;

  DartPackage get arcgisMapPlatformInterface => DartPackage.fromDirectory(
        root.directory('arcgis_map_platform_interface'),
      )!;

  DartPackage get arcgisMapWeb =>
      DartPackage.fromDirectory(root.directory('arcgis_map_web'))!;

  DartPackage get afSidekickPackage =>
      DartPackage.fromDirectory(root.directory('af_sidekick'))!;

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
