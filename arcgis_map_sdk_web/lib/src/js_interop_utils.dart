import 'dart:js_interop' hide JS;

/// Converts JSON-like Dart values to their JavaScript equivalents.
///
/// This keeps the existing `jsify` call sites while using Dart's current JS
/// interop conversion API.
JSAny? jsify(Object? value) => value.jsify();
