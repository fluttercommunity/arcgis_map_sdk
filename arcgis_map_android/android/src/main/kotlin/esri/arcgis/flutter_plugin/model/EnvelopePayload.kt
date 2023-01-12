package esri.arcgis.flutter_plugin.model

import com.esri.arcgisruntime.geometry.Envelope
import com.esri.arcgisruntime.geometry.SpatialReference
import com.esri.arcgisruntime.geometry.SpatialReferences


data class EnvelopePayload(
    val xMin: Double,
    val yMin: Double,
    val xMax: Double,
    val yMax: Double,
)

fun EnvelopePayload.toEnvelope(spatialReferences: SpatialReference = SpatialReferences.getWgs84()) =
    Envelope(xMin, yMin, xMax, yMax, spatialReferences)

fun Envelope.toEnvelopePayload() =
    EnvelopePayload(xMin, yMin, xMax, yMax)
