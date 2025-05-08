package dev.fluttercommunity.arcgis_map_sdk_android.model.symbol

import com.arcgismaps.mapping.symbology.SimpleLineSymbolMarkerPlacement
import com.arcgismaps.mapping.symbology.SimpleLineSymbolMarkerStyle
import com.arcgismaps.mapping.symbology.SimpleLineSymbolStyle
import dev.fluttercommunity.arcgis_map_sdk_android.model.MapColor

data class SimpleLineSymbolPayload(
    val color: MapColor?,
    val marker: LineSymbolMarker?,
    val miterLimit: Double?,
    val style: SimpleLineSymbolStyle,
    val width: Double,
)

data class LineSymbolMarker(
    val color: MapColor,
    val placement: SimpleLineSymbolMarkerPlacement,
    val style: SimpleLineSymbolMarkerStyle,
)
