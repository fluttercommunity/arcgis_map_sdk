package esri.arcgis.flutter_plugin.util

import com.esri.arcgisruntime.geometry.Envelope
import com.esri.arcgisruntime.geometry.Point


class EnvelopeParser {
    companion object {
        fun parse(map: Map<String, Any>): Envelope {
            val minMap = map["min"] as Map<String, Any>
            val maxMap = map["max"] as Map<String, Any>
            val min = Point(minMap["x"] as Double, minMap["y"] as Double)
            val max = Point(maxMap["x"] as Double, maxMap["y"] as Double)

            return Envelope(min, max)
        }
    }
}
