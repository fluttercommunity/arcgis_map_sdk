package esri.arcgis.flutter_plugin.model.symbol

import esri.arcgis.flutter_plugin.model.MapColor

//TODO add marker
data class SimpleLineSymbolPayload(
    val cap: String,
    val color: MapColor,
    val declaredClass: String?,
    val join: String,
    val miterLimit: Double?,
    val style: String,
    val width: Double,
)


data class LineSymbolMarker(
    val color: MapColor
)