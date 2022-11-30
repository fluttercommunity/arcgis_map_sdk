package esri.arcgis.flutter_plugin.model

enum class AnimationCurve {
    LINEAR,
    EASE,
    EASY_IN,
    EASY_OUT,
    EASY_IN_OUT,
}

data class AnimationOptions(
    val duration: Double,
    val animationCurve: AnimationCurve,
)