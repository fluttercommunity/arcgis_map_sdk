package esri.arcgis.flutter_plugin.model.symbol

data class PictureMarkerSymbolPayload(
    val uri: String,
    val width: Double,
    val height: Double,
    val xOffset: Int,
    val yOffset: Int,
)