import 'package:am_sidekick/src/commands/utils.dart';
import 'package:pub_semver/pub_semver.dart';
import 'package:sidekick_core/sidekick_core.dart';

class TestCommand extends Command {
  @override
  final String description =
      'Runs all test in all packages with tests or a single package';

  @override
  final String name = 'test';

  TestCommand() {
    argParser
      ..addFlag('all', hide: true, help: 'deprecated')
      ..addOption(
        'package',
        abbr: 'p',
        allowed:
            findAllPackages(SidekickContext.projectRoot).map((it) => it.name),
      );
  }

  @override
  Future<void> run() async {
    final collector = _TestResultCollector();

    final String? packageArg = argResults?['package'] as String?;

    if (packageArg != null) {
      // only run tests in selected package
      collector.add(runForPackage(
          packageArg, (package) => _test(package, requireTests: true)));
      return;
    }

    // outside of package, fallback to all packages
    final allPackages = findAllPackages(SidekickContext.projectRoot);
    for (final package in allPackages) {
      collector.add(_test(package));
      print('\n');
    }

    if (collector.hasErrors) {
      final failedPackages = collector.results
          .filter((it) => it.result == _TestResult.failed)
          .map((it) => it.package);
      print(
          'Test for module(s) ${failedPackages.joinToString(transform: (it) => 'package: ${it.name}')} failed');
    }
    exit(collector.exitCode);
  }

  CompletedTestRun _test(DartPackage package, {bool requireTests = false}) {
    print(yellow('=== package ${package.name} ==='));
    if (!package.testDir.existsSync()) {
      if (requireTests) {
        error(
          'Could not find a test folder in package ${package.name}. '
          'Please create some tests first.',
        );
      } else {
        print("No tests");
        return CompletedTestRun(_TestResult.noTests, package);
      }
    }

    final pubspec = PubSpec.fromFile(package.root.file('pubspec.yaml').path);
    final minSdk =
        (pubspec.pubspec.environment?.sdkConstraint as VersionRange?)?.min ??
            Version.none;
    final supportsNullSafety = minSdk >= Version(2, 12, 0);

    final exitCode = () {
      if (package.isFlutterPackage) {
        if (!supportsNullSafety) {
          print(
              'WARNING: package ${package.name} is not yet fully migrated to null-safety');
        }
        // only run unit tests in 'test' directory
        return flutter(
            ['test', if (!supportsNullSafety) '--no-sound-null-safety'],
            workingDirectory: package.root);
      } else {
        return dart(['test'], workingDirectory: package.root);
      }
    }();
    if (exitCode == 0) {
      return CompletedTestRun(_TestResult.success, package);
    }
    return CompletedTestRun(_TestResult.failed, package);
  }
}

class _TestResultCollector {
  final List<CompletedTestRun> _results = [];
  List<CompletedTestRun> get results => _results.toList();

  bool get hasErrors => _results.any((it) => it.result == _TestResult.failed);

  void add(CompletedTestRun result) {
    _results.add(result);
  }

  int get exitCode {
    if (hasErrors) {
      return -1;
    }
    if (_results.any((it) => it.result == _TestResult.success)) {
      return 0;
    }
    // no tests or all skipped
    return -2;
  }
}

enum _TestResult {
  success,
  failed,
  noTests,
}

class CompletedTestRun {
  final _TestResult result;
  final DartPackage package;

  CompletedTestRun(this.result, this.package);
}
