package dev.fluttercommunity.arcgis_map_sdk_android.model

import com.arcgismaps.geometry.Point
import com.arcgismaps.geometry.SpatialReference

data class LatLng(
    val longitude: Double,
    val latitude: Double,
)

fun LatLng.toAGSPoint() = Point(longitude, latitude, SpatialReference.wgs84())
