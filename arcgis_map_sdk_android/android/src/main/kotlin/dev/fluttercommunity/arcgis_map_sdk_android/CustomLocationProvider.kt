package dev.fluttercommunity.arcgis_map_sdk_android

import com.arcgismaps.location.CustomLocationDataSource
import com.arcgismaps.location.Location
import dev.fluttercommunity.arcgis_map_sdk_android.model.UserPosition
import dev.fluttercommunity.arcgis_map_sdk_android.model.toAGSPoint
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow

class CustomLocationProvider : CustomLocationDataSource.LocationProvider {
    private val _locations = MutableSharedFlow<Location>(replay = 1)
    private val _headings = MutableSharedFlow<Double>(replay = 1)

    override val locations: Flow<Location> = _locations.asSharedFlow()
    override val headings: Flow<Double> = _headings.asSharedFlow()

    fun updateLocation(position: UserPosition) {
        _locations.tryEmit(
            Location.create(
                position = position.latLng.toAGSPoint(),
                horizontalAccuracy = position.accuracy ?: 0.0,
                verticalAccuracy = position.accuracy ?: 0.0,
                speed = position.velocity ?: 0.0,
                course = position.heading ?: 0.0,
                lastKnown = false,
            )
        )
        position.heading?.let {
            _headings.tryEmit(it)
        }
    }
}