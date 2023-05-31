import 'package:am_sidekick/am_sidekick.dart';
import 'package:am_sidekick/src/commands/cli/cli_flags.dart';
import 'package:sidekick_core/sidekick_core.dart';
import 'package:yaml_edit/yaml_edit.dart';

/// Flags & Options
final overridesFlag = CliFlag(
  name: 'overrides',
  help: 'Enable/disable all the dependency overrides',
);

/// Command to enable/disable the dependency overrides in pubspec.yaml files
class EditDependencyOverridesCommand extends Command {
  @override
  final String description =
      'Enables/disables the dependency overrides in the pubspec.yaml. Use --overrides or --no-overrides';

  @override
  final String name = 'dependency-overrides';

  /// List of all flags and options
  static final List<CliBabo> options = [overridesFlag];

  EditDependencyOverridesCommand() {
    for (final option in options) {
      option.registerWith(argParser);
    }
  }

  @override
  Future<void> run() async {
    final bool overrides = overridesFlag.getFrom(argResults);

    final pubspecFiles = {
      afProject.arcgisMapExample.pubspec,
      afProject.arcgisMap.pubspec,
      afProject.arcgisMapPlatformInterface.pubspec,
      afProject.arcgisMapWeb.pubspec,
    };

    for (final pubspecFile in pubspecFiles) {
      final pathToYaml = pubspecFile.path;
      final yamlFile = File(pathToYaml);
      final yamlContent = yamlFile.readAsStringSync();
      final yamlEditor = YamlEditor(yamlContent);

      if (overrides) {
        /// enable overrides by restoring original file
        print('Trying to restore $pathToYaml from $pathToYaml.bak');

        try {
          final yamlBackupFile = File('$pathToYaml.bak');
          yamlBackupFile.copySync(pathToYaml);
          yamlBackupFile.deleteSync();
        } catch (e) {
          print(yellow('No backup file found for $pathToYaml => Skipping'));
        }
      } else {
        /// disable overrides by removing the dependency_overrides section
        print('Removing dependency overrides from yaml file.');

        /// Copy original file as backup
        print('Backing up $pathToYaml to $pathToYaml.bak');
        yamlFile.copySync('$pathToYaml.bak');
        try {
          yamlEditor.remove(['dependency_overrides']);
          yamlFile.writeAsStringSync(yamlEditor.toString());
        } catch (e) {
          print(
            yellow('No dependency overrides found in $pathToYaml => Skipping'),
          );
        }
      }
    }
  }
}
