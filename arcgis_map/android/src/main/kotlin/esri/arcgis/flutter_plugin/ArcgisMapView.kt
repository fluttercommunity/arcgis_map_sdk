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

/**
 * Native android view for the map since the Flutter map is super slow on old Android devices.
 * Some documentation for the current implementation: https://developers.arcgis.com/android/maps-2d/tutorials/display-a-map/
 * */
internal class ArcgisMapView(
    context: Context,
    viewId: Int,
    binaryMessenger: BinaryMessenger,
    mapOptions: ArcgisMapOptions,
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
        val lodFactor = call.argument<Int>("lodFactor")!! //TODO different error handling

        val newScale = mapView.mapScale + lodFactor

        mapView
            .setViewpointScaleAsync(newScale)
            .addDoneListener { result.success(true) }
    }

    private fun onZoomOut(call: MethodCall, result: MethodChannel.Result) {
        val lodFactor = call.argument<Int>("lodFactor")!! //TODO different error handling

        val newScale = mapView.mapScale - lodFactor

        mapView
            .setViewpointScaleAsync(newScale)
            .addDoneListener { result.success(true) }
    }


    // endregion
}
