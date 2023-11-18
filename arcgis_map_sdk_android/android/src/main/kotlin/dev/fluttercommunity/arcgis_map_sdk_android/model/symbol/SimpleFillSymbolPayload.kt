package dev.fluttercommunity.arcgis_map_sdk_android.model.symbol

import dev.fluttercommunity.arcgis_map_sdk_android.model.MapColor

data class SimpleFillSymbolPayload(
    val fillColor: MapColor,
    val outlineColor: MapColor,
    val outlineWidth: Double,
)