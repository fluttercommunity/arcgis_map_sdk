package esri.arcgis.flutter_plugin.model

data class ArcgisMapOptions(
    val apiKey: String,
    val basemap: String,
    val initialCenter: LatLng,
    val isInteractive: Boolean,
    val zoom: Double,
    val hideDefaultZoomButtons: Boolean,
    val hideAttribution: Boolean,
    val padding: ViewPadding,
    val rotationEnabled: Boolean,
    val minZoom: String,
    val maxZoom: Int,
    val xMin: Double,
    val xMax: Double,
    val yMin: Double,
    val yMax: Double,
)
