package esri.arcgis.flutter_plugin.model.symbol

import esri.arcgis.flutter_plugin.model.MapColor

data class SimpleFillSymbolPayload(
    val fillColor: MapColor,
    val outlineColor: MapColor,
    val outlineWidth: Double,
)