package esri.arcgis.flutter_plugin.model.symbol

import esri.arcgis.flutter_plugin.model.MapColor

//TODO 
data class SimpleLineSymbolPayload(
    val color: MapColor?,
    val declaredClass: String?,
    val miterLimit: Double?,
    val width: Double,
)


data class LineSymbolMarker(
    val color: MapColor
)

