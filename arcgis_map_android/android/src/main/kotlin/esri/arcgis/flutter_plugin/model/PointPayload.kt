package esri.arcgis.flutter_plugin.model

import com.esri.arcgisruntime.geometry.Point
import com.esri.arcgisruntime.geometry.SpatialReferences


data class PointPayload(val x: Double, val y: Double)

fun PointPayload.toPoint() = Point(x, y, SpatialReferences.getWgs84())