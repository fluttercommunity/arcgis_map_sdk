package esri.arcgis.flutter_plugin

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import com.esri.arcgisruntime.ArcGISRuntimeEnvironment
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.Basemap
import com.esri.arcgisruntime.mapping.Viewpoint
import com.esri.arcgisruntime.mapping.view.MapView
import esri.arcgis.flutter_plugin.model.ArcgisMapOptions
import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.platform.PlatformView
import kotlin.math.exp
import kotlin.math.ln
import kotlin.math.roundToInt

/**
 * The PlatformView that displays an ArcGis MapView.
 * A starting point for documentation can be found here: https://developers.arcgis.com/android/maps-2d/tutorials/display-a-map/
 * */
internal class ArcgisMapView(
    context: Context,
    viewId: Int,
    binaryMessenger: BinaryMessenger,
    private val mapOptions: ArcgisMapOptions,
) : PlatformView {

    private val view: View = LayoutInflater.from(context).inflate(R.layout.vector_map_view, null)
    private var mapView: MapView
    private val map = ArcGISMap()


    private val methodChannel =
        MethodChannel(binaryMessenger, "esri.arcgis.flutter_plugin/$viewId")

    override fun getView(): View = view

    init {
        ArcGISRuntimeEnvironment.setApiKey(mapOptions.apiKey)
        mapView = view.findViewById(R.id.mapView)
        map.basemap = Basemap(mapOptions.basemap)
        map.minScale = getMapScale(mapOptions.minZoom)
        map.maxScale = getMapScale(mapOptions.maxZoom)
        mapView.map = map

        val viewPoint = Viewpoint(
            mapOptions.initialCenter.latitude,
            mapOptions.initialCenter.longitude,
            // TODO: we might not be able to have zoom and scale under the same api
            // for now we just multiply it by 1000 to have a similar effect
            mapOptions.zoom * 1000
        )
        mapView.setViewpoint(viewPoint)

        setupMethodChannel()
    }

    override fun dispose() {}

    // region helper

    private fun setupMethodChannel() {
        methodChannel.setMethodCallHandler { call, result ->
            when (call.method) {
                "zoom_in" -> onZoomIn(call = call, result = result)
                "zoom_out" -> onZoomOut(call = call, result = result)
                else -> result.notImplemented()
            }
        }
    }

    private fun onZoomIn(call: MethodCall, result: MethodChannel.Result) {
        val lodFactor = call.argument<Int>("lodFactor")!!
        val currentZoomLevel = getZoomLevel(mapView)
        val totalZoomLevel = currentZoomLevel + lodFactor
        if (totalZoomLevel > mapOptions.maxZoom) {
            return
        }
        val newScale = getMapScale(totalZoomLevel)
        val future = mapView.setViewpointScaleAsync(newScale)
        future.addDoneListener {
            try {
                val isSuccessful = future.get()
                result.success(isSuccessful)
            } catch (e: Exception) {
                result.error("Error", e.message, null)
            }
        }
    }

    private fun onZoomOut(call: MethodCall, result: MethodChannel.Result) {
        val lodFactor = call.argument<Int>("lodFactor")!!
        val currentZoomLevel = getZoomLevel(mapView)
        val totalZoomLevel = currentZoomLevel - lodFactor
        if (totalZoomLevel < mapOptions.minZoom) {
            return
        }
        val newScale = getMapScale(totalZoomLevel)
        val future = mapView.setViewpointScaleAsync(newScale)
        future.addDoneListener {
            try {
                val isSuccessful = future.get()
                if (isSuccessful) {
                    result.success(true)
                } else {
                    result.error("Error", "Zoom animation has been interrupted", null)
                }
            } catch (e: Exception) {
                result.error("Error", e.message, null)
            }
        }
    }

    /**
     * Convert map scale to zoom level
     * https://developers.arcgis.com/documentation/mapping-apis-and-services/reference/zoom-levels-and-scale/#conversion-tool
     * */
    private fun getZoomLevel(mapView: MapView): Int {
        val result = -1.443 * ln(mapView.mapScale) + 29.14
        return result.roundToInt()
    }

    /**
     *  Convert zoom level to map scale
     * https://developers.arcgis.com/documentation/mapping-apis-and-services/reference/zoom-levels-and-scale/#conversion-tool
     * */
    private fun getMapScale(zoomLevel: Int): Double {
        return 591657527 * (exp(-0.693 * zoomLevel))
    }


    // endregion
}


