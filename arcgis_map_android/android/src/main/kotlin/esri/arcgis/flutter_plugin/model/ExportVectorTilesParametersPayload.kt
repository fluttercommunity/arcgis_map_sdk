package esri.arcgis.flutter_plugin.model

import com.esri.arcgisruntime.tasks.vectortilecache.ExportVectorTilesParameters


data class ExportVectorTilesParametersPayload(
    val areaOfInterest: EnvelopePayload,
    val maxLevel: Int
)

fun ExportVectorTilesParametersPayload.toExportVectorTilesParameters(): ExportVectorTilesParameters {
    val parameters = ExportVectorTilesParameters()
    parameters.maxLevel = maxLevel
    parameters.areaOfInterest = areaOfInterest.toEnvelope()
    return parameters
}