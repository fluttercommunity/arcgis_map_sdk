import 'package:am_sidekick/am_sidekick.dart';
import 'package:am_sidekick/src/commands/cli/cli_flags.dart';
import 'package:sidekick_core/sidekick_core.dart';
import 'package:yaml_edit/yaml_edit.dart';

/// Flags & Options
final majorFlag = CliFlag(
  name: 'major',
  help: 'Bumps to the next major version. e.g. 1.2.6+8 => 2.0.0+9',
);
final minorFlag = CliFlag(
  name: 'minor',
  help: 'Bumps to the next minor version. e.g. 1.2.6+8 => 1.3.0+9',
);
final patchFlag = CliFlag(
  name: 'patch',
  help: 'Bumps to the next patch version. e.g. 1.2.6+8 => 1.2.7+9',
);
final versionOption = CliOption(
  name: 'version',
  help: 'Use this specific version instead of bumping',
);

class BumpVersionCommand extends Command {
  @override
  final String description = 'Bumps the arcgis_map_sdk version';

  @override
  final String name = 'bump-version';

  /// List of all flags and options
  static final List<CliBabo> options = [
    majorFlag,
    minorFlag,
    patchFlag,
    versionOption,
  ];

  BumpVersionCommand() {
    for (final option in options) {
      option.registerWith(argParser);
    }
  }

  @override
  Future<void> run() async {
    final bool bumpMajor = majorFlag.getFrom(argResults);
    final bool bumpMinor = minorFlag.getFrom(argResults);
    bool bumpPatch = patchFlag.getFrom(argResults);
    final String versionArg = versionOption.getFrom(argResults);
    final bool versionFlag = versionArg.isNotEmpty;

    /// check that only one flag is set.
    /// If version is set, then no other flag should be set.
    if (versionFlag) {
      if (bumpMajor || bumpMinor || bumpPatch) {
        error(
          red('Cannot use --version and --major/--minor/--patch at the same time'),
        );
      }
    } else {
      if (bumpMajor && bumpMinor) {
        error(red('Cannot use --major and --minor at the same time'));
      }
      if (bumpMajor && bumpPatch) {
        error(red('Cannot use --major and --patch at the same time'));
      }
      if (bumpMinor && bumpPatch) {
        error(red('Cannot use --minor and --patch at the same time'));
      }
    }

    /// Check if any of the flags are set. If not then default to patch.
    if (!bumpMajor && !bumpMinor && !bumpPatch && !versionFlag) {
      print(yellow('No version flag set. Defaulting to --patch'));
      bumpPatch = true;
    }

    final packages = {
      afProject.arcgisMapExample,
      afProject.arcgisMapSdk,
      afProject.arcgisMapSdkPlatformInterface,
      afProject.arcgisMapSdkWeb,
      afProject.arcgisMapSdkAndroid,
      afProject.arcgisMapSdkIos,
      afProject.arcgisMapSdkMethodChannel,
    };
    for (final package in packages) {
      final pubspecFile = package.pubspec;

      final pubSpec = PubSpec.fromFile(pubspecFile.path);
      final version = pubSpec.version!;

      final oldBuildNumber = version.build.firstOrNull as int?;
      var newVersion = version;

      if (versionFlag) {
        newVersion = Version.parse(versionArg);
      } else {
        if (bumpMajor) {
          newVersion = version.nextMajor;
        }
        if (bumpMinor) {
          newVersion = version.nextMinor;
        }
        if (bumpPatch) {
          newVersion = version.nextPatch;
        }
        if (oldBuildNumber != null) {
          final newBuildNumber = oldBuildNumber + 1;

          // build is immutable and null if not present
          newVersion = newVersion.copyWith(build: newBuildNumber.toString());
        }
      }

      /// Update ref versions
      /// NOTE: All package versions need to be in sync, otherwise this approach will not work correctly
      final pathToYaml = pubspecFile.path;
      final yamlFile = File(pathToYaml);
      final yamlContent = yamlFile.readAsStringSync();
      final yamlEditor = YamlEditor(yamlContent);
      for (final packageName in packages) {
        try {
          yamlEditor.update(
            ['dependencies', packageName.name, 'git', 'ref'],
            "v$newVersion",
          );
        } catch (e) {
          /// ignore
        }
      }

      try {
        yamlFile.writeAsStringSync(yamlEditor.toString());
      } catch (e) {
        print(yellow("Could not write to yaml file => ${yamlFile.path}"));
      }

      /// save to disk
      pubspecFile.replaceFirst(version.toString(), newVersion.toString());
      print(
        'arcgis_map_sdk version bumped from ${yellow(version.toString())} => ${green(newVersion.toString())}',
      );
    }
  }
}

extension VersionExtensions on Version {
  /// Creates a copy of [Version], optionally changing [preRelease] and [build]
  Version Function({String? preRelease, String? build}) get copyWith =>
      _copyWith;

  /// Makes it distinguishable if users used `null` or did not provide any value
  static const _defaultParameter = Object();

  // copyWith version which handles `null`, as in freezed
  Version _copyWith({
    dynamic preRelease = _defaultParameter,
    dynamic build = _defaultParameter,
  }) {
    return Version(
      major,
      minor,
      patch,
      pre: () {
        if (preRelease == _defaultParameter) {
          if (this.preRelease.isEmpty) {
            return null;
          }
          return this.preRelease.join('.');
        }
        return preRelease as String?;
      }(),
      build: () {
        if (build == _defaultParameter) {
          if (this.build.isEmpty) {
            return null;
          }
          return this.build.join('.');
        }
        return build as String?;
      }(),
    );
  }
}
