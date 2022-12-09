package esri.arcgis.flutter_plugin.model.symbol

import esri.arcgis.flutter_plugin.model.MapColor

data class SimpleMarkerSymbolPayload(
    val color: MapColor,
    val size: Double,
    val outlineColor: MapColor,
    val outlineWidth: Double,
)