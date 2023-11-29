package dev.fluttercommunity.arcgis_map_sdk_android

import com.esri.arcgisruntime.location.LocationDataSource
import dev.fluttercommunity.arcgis_map_sdk_android.model.UserPosition
import dev.fluttercommunity.arcgis_map_sdk_android.model.toAGSPoint

class ManualLocationDisplayDataSource : LocationDataSource() {

    override fun onStart() {
        this.onStartCompleted(null)
    }

    override fun onStop() {

    }

    fun setNewLocation(userPosition: UserPosition) {
        val loc = Location(
            userPosition.latLng.toAGSPoint(),
            userPosition.accuracy ?: 0.0,
            userPosition.velocity ?: 0.0,
            userPosition.heading ?: 0.0,
            false
        )
        updateLocation(loc)
    }
}
