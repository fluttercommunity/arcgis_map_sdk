import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// A [Widget] that blocks touch and scroll events from being intercepted by underlying PlatformViews.
/// Useful for preserving interaction with overlay widgets like dialogs or bottom sheets when placed over a map
class PointerInterceptorWeb extends StatelessWidget {
  final Widget child;

  const PointerInterceptorWeb({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    if (!kIsWeb) return child;
    return Stack(
      alignment: Alignment.center,
      children: <Widget>[
        Positioned.fill(
          child: HtmlElementView.fromTagName(
            tagName: 'div',
            isVisible: false,
          ),
        ),
        child,
      ],
    );
  }
}
