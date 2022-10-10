package de.tollcollect.sv.smartmv.map.model.route

data class DrawRoutePayload(
    val edges: List<DrawEdge>,
    val envelope: DrawRouteEnvelope?,
)

data class DrawRouteEnvelope(
    val xmin: Double,
    val ymin: Double,
    val xmax: Double,
    val ymax: Double,
)
