package esri.arcgis.flutter_plugin.util

import com.esri.arcgisruntime.geometry.PointCollection
import com.esri.arcgisruntime.geometry.Polygon
import com.esri.arcgisruntime.geometry.Polyline
import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.symbology.PictureMarkerSymbol
import com.esri.arcgisruntime.symbology.SimpleFillSymbol
import com.esri.arcgisruntime.symbology.SimpleLineSymbol
import com.esri.arcgisruntime.symbology.SimpleMarkerSymbol
import com.esri.arcgisruntime.symbology.Symbol
import esri.arcgis.flutter_plugin.model.LatLng
import esri.arcgis.flutter_plugin.model.symbol.PictureMarkerSymbolPayload
import esri.arcgis.flutter_plugin.model.symbol.SimpleFillSymbolPayload
import esri.arcgis.flutter_plugin.model.symbol.SimpleLineSymbolPayload
import esri.arcgis.flutter_plugin.model.symbol.SimpleMarkerSymbolPayload
import esri.arcgis.flutter_plugin.model.toAGSPoint
import esri.arcgis.flutter_plugin.parseToClass

class GraphicsParser {

    companion object {
        fun parse(map: Map<String, Any>): List<Graphic> {

            val graphics = when (val type = map["type"] as String) {
                "point" -> parsePoint(map)
                "polygon" -> parsePolygon(map)
                "polyline" -> parsePolyline(map)
                else -> throw  Exception("No type for $type")
            }

            val attributes = map["attributes"] as? Map<String, String>

            if (attributes != null) {
                return graphics.map {
                    attributes.forEach { (key, value) ->
                        it.attributes[key] = value
                    }
                    it
                }
            }

            return graphics
        }

        private fun parsePoint(map: Map<String, Any>): List<Graphic> {
            val point = (map["point"] as Map<String, Any>).parseToClass<LatLng>()

            val pointGraphic = Graphic().apply {
                geometry = point.toAGSPoint()
                symbol = parseSymbol(map)
            }

            return listOf(pointGraphic)
        }

        private fun parsePolyline(map: Map<String, Any>): List<Graphic> {
            return listOf()
        }

        private fun parsePolygon(map: Map<String, Any>): List<Graphic> {
            return listOf()
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