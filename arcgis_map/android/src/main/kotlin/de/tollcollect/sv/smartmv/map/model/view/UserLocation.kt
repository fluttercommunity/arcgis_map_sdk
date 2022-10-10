package de.tollcollect.sv.smartmv.map.model.view

import de.tollcollect.sv.smartmv.map.model.Coordinate

data class UserLocation(
    val coordinate: Coordinate,
    val indicatorInnerColor: MapColor,
    val indicatorOuterColor: MapColor,
    val focusViewport: Boolean,
    val animationDurationMilliseconds: Double,
)
