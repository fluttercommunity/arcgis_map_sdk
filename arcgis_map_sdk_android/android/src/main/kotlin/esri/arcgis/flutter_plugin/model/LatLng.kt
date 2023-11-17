package esri.arcgis.flutter_plugin.model

import com.esri.arcgisruntime.geometry.Point
import com.esri.arcgisruntime.geometry.SpatialReferences

data class LatLng(
    val longitude: Double,
    val latitude: Double,
)

fun LatLng.toAGSPoint() = Point(longitude, latitude, SpatialReferences.getWgs84())
