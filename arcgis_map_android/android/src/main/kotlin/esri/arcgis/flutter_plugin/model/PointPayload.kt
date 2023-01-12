package esri.arcgis.flutter_plugin.model

import com.esri.arcgisruntime.geometry.Point


data class PointPayload(val x: Double, val y: Double)

fun PointPayload.toPoint() = Point(x, y)