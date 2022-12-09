package esri.arcgis.flutter_plugin.util

import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.symbology.PictureMarkerSymbol
import com.esri.arcgisruntime.symbology.SimpleFillSymbol
import com.esri.arcgisruntime.symbology.SimpleLineSymbol
import com.esri.arcgisruntime.symbology.SimpleMarkerSymbol
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

            (map["attributes"] as? Map<String, String>)?.forEach { (key, value) ->
                graphic.attributes[key] = value
            }

            return graphic
        }

        private fun parsePolyline(map: Map<String, Any>): Graphic {

            //TODO

            return Graphic().apply {

            }
        }

        private fun parsePolygon(map: Map<String, Any>): Graphic {

            //TODO

            return Graphic().apply {

            }
        }

        private fun parsePoint(map: Map<String, Any>): Graphic {

            //TODO

            return Graphic().apply {

            }
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

            return SimpleMarkerSymbol().apply {
                color = payload.color.toHexInt()
                size = payload.size.toFloat()
                outline = SimpleLineSymbol().apply {
                    style = SimpleLineSymbol.Style.SOLID
                    color = payload.outlineColor.toHexInt()
                    width = payload.outlineWidth.toFloat()
                }
            }
        }

        private fun parsePictureMarkerSymbol(map: Map<String, Any>): Symbol {
            val payload = map.parseToClass<PictureMarkerSymbolPayload>()

            return PictureMarkerSymbol(payload.uri).apply {
                width = payload.width.toFloat()
                height = payload.height.toFloat()
                offsetX = payload.xOffset.toFloat()
                offsetY = payload.yOffset.toFloat()
            }
        }

        private fun parseSimpleFillSymbol(map: Map<String, Any>): Symbol {
            val payload = map.parseToClass<SimpleFillSymbolPayload>()

            return SimpleFillSymbol().apply {
                color = payload.fillColor.toHexInt()
                outline = SimpleLineSymbol().apply {
                    style = SimpleLineSymbol.Style.SOLID
                    color = payload.outlineColor.toHexInt()
                    width = payload.outlineWidth.toFloat()
                }
            }
        }

        private fun parseSimpleLineSymbol(map: Map<String, Any>): Symbol {
            val payload = map.parseToClass<SimpleLineSymbolPayload>()

            return SimpleLineSymbol().apply {
                if (payload.color != null) color = payload.color.toHexInt()
                markerStyle = payload.marker?.style
                markerPlacement = payload.marker?.placement
                style = payload.style
                width = payload.width.toFloat()
            }

        }
    }

}