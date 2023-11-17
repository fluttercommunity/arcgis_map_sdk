package esri.arcgis.flutter_plugin.model

import android.graphics.Color
import kotlin.math.roundToInt

data class MapColor(
    val red: Int,
    val green: Int,
    val blue: Int,
    val opacity: Double
) {

    // Impl taken from https://stackoverflow.com/a/18037185/4648625
    fun toHexInt(): Int {
        return Color.argb((255 * opacity).roundToInt(), red, green, blue);
    }
}
