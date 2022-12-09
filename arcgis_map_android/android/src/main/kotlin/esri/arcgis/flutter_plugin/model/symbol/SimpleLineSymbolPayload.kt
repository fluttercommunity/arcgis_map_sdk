package esri.arcgis.flutter_plugin.model.symbol

import com.esri.arcgisruntime.symbology.SimpleLineSymbol
import com.esri.arcgisruntime.symbology.StrokeSymbolLayer
import esri.arcgis.flutter_plugin.model.MapColor

data class SimpleLineSymbolPayload(
    val cap: StrokeSymbolLayer.CapStyle,
    val color: MapColor?,
    val declaredClass: String?,
    val join: JoinStyle,
    val marker: LineSymbolMarker?,
    val miterLimit: Double?,
    val style: PolylineStyle,
    val width: Double,
)

data class LineSymbolMarker(
    val color: MapColor,
    val declaredClass: String?,
    val placement: SimpleLineSymbol.MarkerPlacement,
    val style: SimpleLineSymbol.MarkerStyle,
)

//TODO try to drop
enum class JoinStyle {
    miter, round, bevel
}

//TODO try to drop
enum class PolylineStyle {
    dash, dashDot, dot, longDash, longDashDot, longDashDotDot, none, shortDash, shortDashDot, shortDashDotDot, shortDot, solid,
}
