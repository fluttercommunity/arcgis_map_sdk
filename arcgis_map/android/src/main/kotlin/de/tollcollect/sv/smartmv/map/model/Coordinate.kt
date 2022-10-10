package de.tollcollect.sv.smartmv.map.model

import com.esri.arcgisruntime.geometry.Point
import com.esri.arcgisruntime.geometry.SpatialReferences

data class Coordinate(
    val long: Double,
    val lat: Double,
)

fun Coordinate.toPoint() = Point(long, lat, SpatialReferences.getWgs84())
fun Point.toCoordinate() = Coordinate(long = x, lat = y)
