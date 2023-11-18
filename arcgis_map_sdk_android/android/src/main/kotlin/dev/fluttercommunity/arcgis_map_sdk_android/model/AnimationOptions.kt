package dev.fluttercommunity.arcgis_map_sdk_android.model

import com.esri.arcgisruntime.mapping.view.AnimationCurve

data class AnimationOptions(
    val duration: Double,
    val animationCurve: AnimationCurve,
)