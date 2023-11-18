package dev.fluttercommunity.arcgis_map_sdk_android.model.symbol

import dev.fluttercommunity.arcgis_map_sdk_android.model.MapColor

data class SimpleMarkerSymbolPayload(
    val color: MapColor,
    val size: Double,
    val outlineColor: MapColor,
    val outlineWidth: Double,
)