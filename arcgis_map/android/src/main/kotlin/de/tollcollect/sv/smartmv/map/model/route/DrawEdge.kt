package de.tollcollect.sv.smartmv.map.model.route

import de.tollcollect.sv.smartmv.map.model.view.MapColor

data class DrawEdge(
    val compressedGeometry: String,
    val edgeColor: MapColor,
)
