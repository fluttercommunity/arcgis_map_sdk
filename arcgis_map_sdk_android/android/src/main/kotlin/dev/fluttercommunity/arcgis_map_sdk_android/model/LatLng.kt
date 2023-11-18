package dev.fluttercommunity.arcgis_map_sdk_android.model

import com.esri.arcgisruntime.geometry.Point
import com.esri.arcgisruntime.geometry.SpatialReferences

data class LatLng(
    val longitude: Double,
    val latitude: Double,
)

fun LatLng.toAGSPoint() = Point(longitude, latitude, SpatialReferences.getWgs84())
