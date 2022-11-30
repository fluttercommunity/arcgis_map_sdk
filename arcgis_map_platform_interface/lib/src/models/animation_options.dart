/// Animation options for the [goTo] Javascript method.
///
/// * [animationCurve] is the animation curve used for this animation.
///
/// * [duration] of the animation in milliseconds.
///
/// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#GoToOptions2D
class AnimationOptions {
  final double duration;
  final AnimationCurve animationCurve;

  AnimationOptions({
    this.duration = 200,
    this.animationCurve = AnimationCurve.ease,
  }) : assert(duration > 0.0);

  Map<String, dynamic> toMap() {
    return {'duration': duration, 'animationCurve': animationCurve.name};
  }
}

enum AnimationCurve { linear, ease, easeIn, easeOut, easeInOut }

extension AnimationOptionsExt on AnimationCurve {
  static const Map<AnimationCurve, String> values = {
    AnimationCurve.linear: 'linear',
    AnimationCurve.ease: 'ease',
    AnimationCurve.easeIn: 'ease-in',
    AnimationCurve.easeOut: 'ease-out',
    AnimationCurve.easeInOut: 'ease-in-out',
  };

  String get value => values[this]!;
}
