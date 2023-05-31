import 'package:sidekick_core/sidekick_core.dart';

/// Create main class for CliFlag and CliOption
abstract class CliBabo {
  final String name;
  final String help;

  CliBabo({
    required this.name,
    required this.help,
  });

  void registerWith(ArgParser parser);

  /// Returns the value of the flag
  T getFrom<T>(ArgResults? results);
}

/// Create CliFlag
class CliFlag extends CliBabo {
  final bool negatable;

  CliFlag({
    required super.name,
    required super.help,
    this.negatable = false,
  });

  @override
  void registerWith(ArgParser parser) {
    parser.addFlag(
      name,
      help: help,
      negatable: negatable,
    );
  }

  /// Returns as command line arg
  String asCommandlineArg(ArgResults? results) {
    final bool flag = results?[name] as bool? ?? false;
    return flag ? '--$name' : '';
  }

  @override
  bool getFrom<bool>(ArgResults? results) {
    return results?[name] as bool? ?? false as bool;
  }
}

/// Create CliOption
class CliOption extends CliBabo {
  CliOption({
    required super.name,
    required super.help,
  });

  @override
  void registerWith(ArgParser parser) {
    parser.addOption(
      name,
      help: help,
    );
  }

  /// Returns as command line arg
  String asCommandlineArg(ArgResults? results) {
    final String flagResult = (results?[name] as String?) ?? '';
    final bool flag = (results?[name] as String?)?.isNotEmpty ?? false;
    return flag ? '--$name=$flagResult' : '';
  }

  @override
  String getFrom<String>(ArgResults? results) {
    return (results?[name] as String?) ?? '' as String;
  }
}
