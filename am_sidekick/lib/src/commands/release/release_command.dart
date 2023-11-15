import 'package:am_sidekick/am_sidekick.dart';
import 'package:am_sidekick/src/commands/release/bump_version_command.dart';
import 'package:am_sidekick/src/commands/release/edit_dependency_overrides_command.dart';
import 'package:am_sidekick/src/commands/release/publish_command.dart';
import 'package:sidekick_core/sidekick_core.dart';

class ReleaseCommand extends Command {
  @override
  final String description = "Releases new version of a package. "
      "This will create a new tag and commit the changes "
      "to the current branch!";

  @override
  final String name = 'release';

  ReleaseCommand() {
    /// Bump version
    for (final option in BumpVersionCommand.options) {
      option.registerWith(argParser);
    }

    /// Overrides
    for (final option in EditDependencyOverridesCommand.options) {
      option.registerWith(argParser);
    }

    /// Dry run
    dryRunFlag.registerWith(argParser);
  }

  String? _getGitUserName() =>
      'git config user.name'.start(progress: Progress.capture()).firstLine;

  @override
  Future<void> run() async {
    print('Hey ${_getGitUserName() ?? 'developer'}, ');
    sleep(400, interval: Interval.milliseconds);
    print('lets ship a new version!');
    sleep(1);

    /// 1. Bump version
    print('');
    print(orange('Version stage started'));

    /// Let it rip!
    await runAm([
      'bump-version',
      majorFlag.asCommandlineArg(argResults),
      minorFlag.asCommandlineArg(argResults),
      patchFlag.asCommandlineArg(argResults),
      versionOption.asCommandlineArg(argResults)
    ]);
    print(orange('Version stage done'));

    /// 2. Remove dependency overrides
    print('');
    print(orange('Dependency overrides stage started'));

    /// Let it rip!
    await runAm(['dependency-overrides']);
    print(orange('Dependency overrides stage done'));

    /// 3. Commit the changes and create a new tag
    print('');
    print(orange('Tag/commit stage started'));

    /// Let it rip!
    await runAm(
      ['publish', dryRunFlag.asCommandlineArg(argResults)],
    );
    print(orange('Tag/commit stage done'));
    print('');

    print(green('--- Creation of a new version is completed! ---'));
    print('');
  }
}
