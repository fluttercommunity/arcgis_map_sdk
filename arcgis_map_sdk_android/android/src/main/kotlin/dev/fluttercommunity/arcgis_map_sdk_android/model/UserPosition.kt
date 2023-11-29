package dev.fluttercommunity.arcgis_map_sdk_android.model

data class UserPosition(
    val latLng: LatLng,
    val accuracy: Double?,
    val heading: Double?,
    val velocity: Double?
)
