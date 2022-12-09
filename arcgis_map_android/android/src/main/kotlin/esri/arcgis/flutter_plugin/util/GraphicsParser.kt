package esri.arcgis.flutter_plugin.util

import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.symbology.Symbol
import esri.arcgis.flutter_plugin.model.symbol.PictureMarkerSymbolPayload
import esri.arcgis.flutter_plugin.model.symbol.SimpleFillSymbolPayload
import esri.arcgis.flutter_plugin.model.symbol.SimpleLineSymbolPayload
import esri.arcgis.flutter_plugin.model.symbol.SimpleMarkerSymbolPayload
import esri.arcgis.flutter_plugin.parseToClass

class GraphicsParser {


    companion object {
        fun parse(map: Map<String, Any>): Graphic {

            val graphic = when (val type = map["type"] as String) {
                "point" -> parsePoint(map)
                "polygon" -> parsePolygon(map)
                "polyline" -> parsePolyline(map)
                else -> throw  Exception("No type for $type")
            }

            return graphic
        }

        private fun parsePolyline(map: Map<String, Any>): Graphic {
            //TODO
            return Graphic()
        }

        private fun parsePolygon(map: Map<String, Any>): Graphic {
            //TODO

            return Graphic()
        }

        private fun parsePoint(map: Map<String, Any>): Graphic {

            //TODO

            return Graphic()
        }


        private fun parseSymbol(map: Map<String, Any>): Symbol {
            val symbolMap = map["symbol"] as Map<String, Any>

            val symbol = when (val type = symbolMap["type"]) {
                "simple-marker" -> parseSimpleMarkerSymbol(symbolMap)
                "picture-marker" -> parsePictureMarkerSymbol(symbolMap)
                "simple-fill" -> parseSimpleFillSymbol(symbolMap)
                "simple-line" -> parseSimpleLineSymbol(symbolMap)
                else -> throw Exception("No type for $type")
            }

            return symbol
        }

        private fun parseSimpleMarkerSymbol(map: Map<String, Any>): Symbol {
            val payload = map.parseToClass<SimpleMarkerSymbolPayload>()



            TODO()
        }

        private fun parsePictureMarkerSymbol(map: Map<String, Any>): Symbol {
            val payload = map.parseToClass<PictureMarkerSymbolPayload>()

            TODO()
        }

        private fun parseSimpleFillSymbol(map: Map<String, Any>): Symbol {
            val payload = map.parseToClass<SimpleFillSymbolPayload>()

            TODO()
        }

        private fun parseSimpleLineSymbol(map: Map<String, Any>): Symbol {
            val payload = map.parseToClass<SimpleLineSymbolPayload>()

            TODO()
        }
    }

}