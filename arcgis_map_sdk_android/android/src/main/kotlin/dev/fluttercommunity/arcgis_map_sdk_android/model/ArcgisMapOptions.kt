package dev.fluttercommunity.arcgis_map_sdk_android.model

import com.esri.arcgisruntime.mapping.BasemapStyle

data class ArcgisMapOptions(
    val apiKey: String?,
    val licenseKey: String?,
    val basemap: BasemapStyle?,
    val vectorTilesUrls: List<String>,
    val initialCenter: LatLng,
    val isInteractive: Boolean,
    val zoom: Double,
    val hideDefaultZoomButtons: Boolean,
    val hideAttribution: Boolean,
    val padding: ViewPadding,
    val rotationEnabled: Boolean,
    val minZoom: Int,
    val maxZoom: Int,
    val xMin: Double,
    val xMax: Double,
    val yMin: Double,
    val yMax: Double,
    val isAttributionTextVisible: Boolean?,
)
