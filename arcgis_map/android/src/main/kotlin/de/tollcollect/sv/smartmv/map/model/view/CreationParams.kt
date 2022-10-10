package de.tollcollect.sv.smartmv.map.model.view

import de.tollcollect.sv.smartmv.map.model.Coordinate

data class CreationParams(
    val apiKey: String,
    val tileServerUrl: String,
    val center: Coordinate?,
    val minScaleFactor: Double,
    val maxScaleFactor: Double,
)
