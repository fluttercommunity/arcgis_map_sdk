import 'package:am_sidekick/am_sidekick.dart';
import 'package:sidekick_core/sidekick_core.dart';

T runForPackage<T>(String name, T Function(DartPackage package) block) {
  final DartPackage? package =
      afProject.allPackages.firstOrNullWhere((it) => it.name == name);
  if (package == null) {
    final packageOptions =
        afProject.allPackages.map((it) => it.name).toList(growable: false);
    error(
      'Could not find package $name. '
      'Please use one of ${packageOptions.joinToString()}',
    );
  }
  return block(package);
}
