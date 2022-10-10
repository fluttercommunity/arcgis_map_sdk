package de.tollcollect.sv.smartmv.map.model.view

import de.tollcollect.sv.smartmv.map.model.Coordinate

data class AppendToUserRoute(
    val coordinates: List<Coordinate>,
    val lineColor: MapColor
)
