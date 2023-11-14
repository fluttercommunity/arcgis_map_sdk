import 'package:am_sidekick/am_sidekick.dart';
import 'package:am_sidekick/src/commands/cli/cli_flags.dart';
import 'package:sidekick_core/sidekick_core.dart';

/// Flags & Options
final dryRunFlag = CliFlag(
  name: 'dry-run',
  help: 'Dry run the release. No changes will be pushed or committed.',
);

class PublishCommand extends Command {
  @override
  final String description =
      'Commits & tags the new version and releases the kraken!';

  @override
  final String name = 'release-the-kraken';

  /// List of all flags and options
  static final List<CliBabo> options = [dryRunFlag];

  PublishCommand() {
    for (final option in options) {
      option.registerWith(argParser);
    }
  }

  @override
  Future<void> run() async {
    /// Get all tags from origin for correct divs
    'git fetch -t'.run;

    /// Get the current branch
    final newVersionBranch = _getCurrentBranch(SidekickContext.repository!);

    final bool dryRun = dryRunFlag.getFrom(argResults);

    final packages = {
      afProject.arcgisMap,
      afProject.arcgisMapExample,
      afProject.arcgisMapPlatformInterface,
      afProject.arcgisMapWeb,
    };

    /// Get the version from the pubspec to tag
    final pubspecFile = packages.first.pubspec;
    final pubSpec = PubSpec.fromFile(pubspecFile.path);
    final tagVersion = pubSpec.version;

    if (tagVersion == null) {
      error(red('No version found in pubspec.yaml.'));
    }

    bool areThereStagedFiles = false;
    bool isInDetachedHEAD = false;

    /// Commit the version bump
    final allFilesDiff =
        'git diff --cached --quiet --exit-code'.start(nothrow: true);
    areThereStagedFiles = allFilesDiff.exitCode != 0;

    if (areThereStagedFiles) {
      error(red('There are staged files, not committing version bump'));
    }

    final detachedHEAD = 'git symbolic-ref -q HEAD'
        .start(progress: Progress.printStdErr(), nothrow: true);
    isInDetachedHEAD = detachedHEAD.exitCode != 0;

    if (isInDetachedHEAD) {
      error(
        red('You are in "detached HEAD" state. Not committing version bump'),
      );
    }

    for (final package in packages) {
      final pubspecFile = package.pubspec;

      if (!dryRun) {
        'git add ${pubspecFile.path}'.start(progress: Progress.printStdErr());
      }
    }

    if (!dryRun) {
      'git commit -m "Bump version to $tagVersion" --no-verify'
          .start(progress: Progress.printStdErr());
      'git --no-pager log -n1 --oneline'.run;
    } else {
      print(yellow('DRY RUN - Would have committed version bump.'));
    }

    /// Tag the version bump
    if (!dryRun) {
      'git tag -a v$tagVersion -m "v$tagVersion"'
          .start(progress: Progress.printStdErr());
      'git --no-pager log -n1 --oneline'.run;
    } else {
      print(yellow('DRY RUN - Would have tagged v$tagVersion'));
    }

    /// PUSH
    if (!dryRun) {
      print(' - Pushing changelog and version bump ...');
      'git push origin $newVersionBranch'.runInRepo;

      print(' - Pushing tag v$tagVersion to origin...');
      'git push origin refs/tags/v$tagVersion'.run;
    } else {
      print(
        yellow(
          'DRY RUN - Would have pushed version bump and tag v$tagVersion to origin.',
        ),
      );
    }

    /// Call `pub get` in all yaml files to update the dependencies.
    print('');
    print(orange(' - Updating dependencies'));
    await runAm(['deps']);

    /// Add the new `pubspec.lock` files.
    for (final package in packages) {
      final pubspecFile = package.pubspec;

      if (!dryRun) {
        'git add ${pubspecFile.parent.path}/pubspec.lock'
            .start(progress: Progress.printStdErr());
      }
    }

    /// Commit the pubspec.lock files
    if (!dryRun) {
      'git commit -m "Add new pubspec.lock files" --no-verify'
          .start(progress: Progress.printStdErr());
      'git --no-pager log -n1 --oneline'.run;
    } else {
      print(yellow('DRY RUN - Would have committed new pubspec.lock files.'));
    }

    /// Move Tag to new commit
    if (!dryRun) {
      print(' - Removing old tag');
      'git tag -d v$tagVersion'.run;
      'git push --delete origin refs/tags/v$tagVersion'.run;

      print(' - Pulling');
      'git pull'.run;

      print(' - Moving tag to new commit');
      'git tag -a v$tagVersion -m "v$tagVersion - auto generated"'
          .start(progress: Progress.printStdErr());
      'git --no-pager log -n1 --oneline'.run;
    } else {
      print(yellow('DRY RUN - Would have moved the tag.'));
    }

    /// PUSH
    if (!dryRun) {
      print(' - Pushing new pubspec.lock files ...');
      'git push origin $newVersionBranch'.runInRepo;

      print(' - Pushing tag v$tagVersion to origin...');
      'git push origin refs/tags/v$tagVersion'.run;
    } else {
      print(
        yellow(
          'DRY RUN - Would have pushed new pubspec.lock files and tag v$tagVersion to origin.',
        ),
      );
    }
  }
}

String _getCurrentBranch(Directory directory) {
  final path = directory.path;
  final currentBranch = 'git branch --show-current'
      .start(progress: Progress.capture(), workingDirectory: path)
      .firstLine;

  if (currentBranch == null) {
    throw "Couldn't determine current branch for git repository at $path";
  }
  return currentBranch;
}

extension on String {
  void get runInRepo {
    assert(
      SidekickContext.repository != null,
      'Release command must be run in a repository',
    );
    start(workingDirectory: SidekickContext.repository!.path);
  }
}
