package esri.arcgis.flutter_plugin.model

import com.esri.arcgisruntime.mapping.view.AnimationCurve

data class AnimationOptions(
    val duration: Double,
    val animationCurve: AnimationCurve,
)