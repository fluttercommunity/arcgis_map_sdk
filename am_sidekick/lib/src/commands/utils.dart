import 'package:sidekick_core/sidekick_core.dart';

T runForPackage<T>(String name, T Function(DartPackage package) block) {
  final allPackages = findAllPackages(SidekickContext.projectRoot);
  final DartPackage? package =
      allPackages.firstOrNullWhere((it) => it.name == name);
  if (package == null) {
    final packageOptions =
        allPackages.map((it) => it.name).toList(growable: false);
    error(
      'Could not find package $name. '
      'Please use one of ${packageOptions.joinToString()}',
    );
  }
  return block(package);
}
