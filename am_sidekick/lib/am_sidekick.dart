import 'dart:async';

import 'package:am_sidekick/src/arcgis_flutter_project.dart';
import 'package:am_sidekick/src/commands/clean_command.dart';
import 'package:am_sidekick/src/commands/generate_arcgis_webpack.dart';
import 'package:am_sidekick/src/commands/release/bump_version_command.dart';
import 'package:am_sidekick/src/commands/release/edit_dependency_overrides_command.dart';
import 'package:am_sidekick/src/commands/release/publish_command.dart';
import 'package:am_sidekick/src/commands/release/release_command.dart';
import 'package:am_sidekick/src/commands/test_command.dart';
import 'package:sidekick_core/sidekick_core.dart';

ArcgisFlutterProject afProject =
    ArcgisFlutterProject(SidekickContext.projectRoot);

Future<void> runAm(List<String> args) async {
  final runner = initializeSidekick(
    mainProjectPath: 'arcgis_map',
    flutterSdkPath: systemFlutterSdkPath(),
  );

  runner
    ..addCommand(FlutterCommand())
    ..addCommand(DartCommand())
    ..addCommand(DepsCommand())
    ..addCommand(CleanCommand())
    ..addCommand(DartAnalyzeCommand())
    ..addCommand(FormatCommand())
    ..addCommand(BumpVersionCommand())
    ..addCommand(SidekickCommand())
    ..addCommand(EditDependencyOverridesCommand())
    ..addCommand(PublishCommand())
    ..addCommand(ReleaseCommand())
    ..addCommand(TestCommand())
    ..addCommand(GenerateArcgisWebpack());

  try {
    return await runner.run(args);
  } on UsageException catch (e) {
    print(e);
    exit(64); // usage error
  }
}
