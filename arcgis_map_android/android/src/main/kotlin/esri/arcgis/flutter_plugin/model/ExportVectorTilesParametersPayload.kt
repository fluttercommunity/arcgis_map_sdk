package esri.arcgis.flutter_plugin.model

import com.esri.arcgisruntime.geometry.SpatialReferences
import com.esri.arcgisruntime.tasks.vectortilecache.ExportVectorTilesParameters


data class ExportVectorTilesParametersPayload(
    val areaOfInterest: EnvelopePayload,
    val maxLevel: Int
)

fun ExportVectorTilesParametersPayload.toExportVectorTilesParameters(): ExportVectorTilesParameters {
    val parameters = ExportVectorTilesParameters()
    parameters.maxLevel = maxLevel
    // Use WebMercator spatial reference because MapView.getVisibleArea() is using it
    parameters.areaOfInterest = areaOfInterest.toEnvelope(SpatialReferences.getWebMercator())
    return parameters
}