import 'package:am_sidekick/am_sidekick.dart';
import 'package:dcli/dcli.dart' as dcli;
import 'package:sidekick_core/sidekick_core.dart';

/// Command to generate the ArcGIS Webpack files
class GenerateArcgisWebpack extends Command {
  @override
  String get description => 'Generates the ArcGIS Webpack files';

  @override
  String get name => 'gen:arcgis-webpack';

  @override
  Future<void> run() async {
    final root = afProject.root;
    final arcgisWebpackPath = root.directory('arcgis_webpack').path;
    final arcgisMapWebPath = root.directory('arcgis_map_web').path;
    print('Root path: $arcgisWebpackPath');

    /// Check if NPM is installed
    if (which('npm').notfound)
      throw 'NPM is not installed. Please install NPM to continue.';
    print(green('Generate ArcGIS Webpack'));
    print('');
    print(orange('Run npm install ...'));
    dcli.run('npm i', workingDirectory: arcgisWebpackPath);
    print('');
    print(orange('Run npm build ...'));
    dcli.run('npm run build', workingDirectory: arcgisWebpackPath);

    print(green('Generating ArcGIS Webpack files Done!'));
    print('');

    print(green('Check assets folder for new files'));
    print('');

    print(orange('Install assets_generator ...'));
    dcli.run('dart pub global activate assets_generator',
        workingDirectory: arcgisMapWebPath);

    print(orange('Generate assets ...'));
    dcli.run('$HOME/.pub-cache/bin/agen -t d -s -r lwu --no-watch',
        workingDirectory: arcgisMapWebPath);

    print('');
    print(green('Checking asset files Done!'));
    print('');
  }
}
