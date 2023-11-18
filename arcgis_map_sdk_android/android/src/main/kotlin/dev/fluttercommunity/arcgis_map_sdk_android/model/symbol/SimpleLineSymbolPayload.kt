package dev.fluttercommunity.arcgis_map_sdk_android.model.symbol

import com.esri.arcgisruntime.symbology.SimpleLineSymbol
import dev.fluttercommunity.arcgis_map_sdk_android.model.MapColor

data class SimpleLineSymbolPayload(
    val color: MapColor?,
    val marker: LineSymbolMarker?,
    val miterLimit: Double?,
    val style: SimpleLineSymbol.Style,
    val width: Double,
)

data class LineSymbolMarker(
    val color: MapColor,
    val placement: SimpleLineSymbol.MarkerPlacement,
    val style: SimpleLineSymbol.MarkerStyle,
)
