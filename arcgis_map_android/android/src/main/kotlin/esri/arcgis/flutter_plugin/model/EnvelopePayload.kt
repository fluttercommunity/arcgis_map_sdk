package esri.arcgis.flutter_plugin.model

import com.esri.arcgisruntime.geometry.Envelope


data class EnvelopePayload(val min: PointPayload, val max: PointPayload)

fun EnvelopePayload.toEnvelope() = Envelope(min.toPoint(), max.toPoint())
fun Envelope.toEnvelopePayload() =
    EnvelopePayload(PointPayload(xMin, yMin), PointPayload(xMax, yMax))
