package dev.fluttercommunity.arcgis_map_sdk_android.util

import com.esri.arcgisruntime.geometry.Point
import com.esri.arcgisruntime.geometry.PointCollection
import com.esri.arcgisruntime.geometry.Polygon
import com.esri.arcgisruntime.geometry.Polyline
import com.esri.arcgisruntime.geometry.SpatialReferences
import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.symbology.PictureMarkerSymbol
import com.esri.arcgisruntime.symbology.SimpleFillSymbol
import com.esri.arcgisruntime.symbology.SimpleLineSymbol
import com.esri.arcgisruntime.symbology.SimpleMarkerSymbol
import com.esri.arcgisruntime.symbology.Symbol
import dev.fluttercommunity.arcgis_map_sdk_android.model.LatLng
import dev.fluttercommunity.arcgis_map_sdk_android.model.symbol.PictureMarkerSymbolPayload
import dev.fluttercommunity.arcgis_map_sdk_android.model.symbol.SimpleFillSymbolPayload
import dev.fluttercommunity.arcgis_map_sdk_android.model.symbol.SimpleLineSymbolPayload
import dev.fluttercommunity.arcgis_map_sdk_android.model.symbol.SimpleMarkerSymbolPayload
import dev.fluttercommunity.arcgis_map_sdk_android.model.toAGSPoint
import dev.fluttercommunity.arcgis_map_sdk_android.parseToClass

class GraphicsParser {

    companion object {
        fun parse(map: Map<String, Any>): List<Graphic> {

            val graphics = when (val type = map["type"] as String) {
                "point" -> parsePoint(map)
                "polygon" -> parsePolygon(map)
                "polyline" -> parsePolyline(map)
                else -> throw Exception("No type for $type")
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
            val points = parseToClass<List<List<List<Double>>>>(map["paths"]!!)

            return points.map { subPoints ->
                Graphic().apply {
                    geometry = Polyline(PointCollection(subPoints.map { coordinateArray ->
                        val x = coordinateArray.elementAtOrNull(0)
                        val y = coordinateArray.elementAtOrNull(1)
                        val z = coordinateArray.elementAtOrNull(2)
                        if (x == null || y == null) {
                            throw Exception("Coordinate array needs at least 2 doubles. Got $coordinateArray")
                        }

                        if (z != null) Point(x, y, z, SpatialReferences.getWgs84())
                        else Point(x, y, SpatialReferences.getWgs84())
                    }))
                    symbol = parseSymbol(map)
                }
            }
        }

        private fun parsePolygon(map: Map<String, Any>): List<Graphic> {
            val rings = parseToClass<List<List<List<Double>>>>(map["rings"]!!)

            return rings.map { ring ->
                Graphic().apply {
                    geometry =
                        Polygon(PointCollection(ring.map { LatLng(it[0], it[1]).toAGSPoint() }))
                    symbol = parseSymbol(map)
                }
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

            return PictureMarkerSymbol(payload.url).apply {
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
                payload.marker?.let {
                    markerStyle = it.style
                    markerPlacement = it.placement
                }

                style = payload.style
                width = payload.width.toFloat()
            }

        }
    }

}
