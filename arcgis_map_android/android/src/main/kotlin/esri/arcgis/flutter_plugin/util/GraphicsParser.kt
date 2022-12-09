package esri.arcgis.flutter_plugin.util

import com.esri.arcgisruntime.mapping.view.Graphic
import esri.arcgis.flutter_plugin.model.symbol.PictureMarkerSymbolPayload
import esri.arcgis.flutter_plugin.model.symbol.SimpleFillSymbolPayload
import esri.arcgis.flutter_plugin.model.symbol.SimpleLineSymbolPayload
import esri.arcgis.flutter_plugin.model.symbol.SimpleMarkerSymbolPayload
import esri.arcgis.flutter_plugin.parseToClass

class GraphicsParser {


    companion object {
        fun parse(map: Map<String, Any>): Graphic {

            val type = map["type"] as String

            val symbol = when (type) {
                "simple-marker" -> map.parseToClass<SimpleMarkerSymbolPayload>()
                "picture-marker" -> map.parseToClass<PictureMarkerSymbolPayload>()
                "simple-fill" -> map.parseToClass<SimpleFillSymbolPayload>()
                "simple-line" -> map.parseToClass<SimpleLineSymbolPayload>()
                else -> throw Exception("No type for $type")
            }

            //TODO symbol
            return Graphic()
        }
    }

}