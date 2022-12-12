package esri.arcgis.flutter_plugin

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import com.esri.arcgisruntime.ArcGISRuntimeEnvironment
import com.esri.arcgisruntime.layers.ArcGISVectorTiledLayer
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.Basemap
import com.esri.arcgisruntime.mapping.Viewpoint
import com.esri.arcgisruntime.mapping.view.AnimationCurve
import com.esri.arcgisruntime.mapping.view.GraphicsOverlay
import com.esri.arcgisruntime.mapping.view.MapView
import esri.arcgis.flutter_plugin.model.AnimationOptions
import esri.arcgis.flutter_plugin.model.ArcgisMapOptions
import esri.arcgis.flutter_plugin.model.LatLng
import esri.arcgis.flutter_plugin.model.ViewPadding
import esri.arcgis.flutter_plugin.util.GraphicsParser
import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.EventChannel
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
    private val viewId: Int,
    private val binaryMessenger: BinaryMessenger,
    private val mapOptions: ArcgisMapOptions,
) : PlatformView {

    private val view: View = LayoutInflater.from(context).inflate(R.layout.vector_map_view, null)
    private var mapView: MapView
    private val map = ArcGISMap()
    private val defaultGraphicsOverlay = GraphicsOverlay()

    private lateinit var zoomStreamHandler: ZoomStreamHandler

    private val methodChannel =
        MethodChannel(binaryMessenger, "esri.arcgis.flutter_plugin/$viewId")

    override fun getView(): View = view

    init {
        ArcGISRuntimeEnvironment.setApiKey(mapOptions.apiKey)
        mapView = view.findViewById(R.id.mapView)

        if (mapOptions.basemap != null) {
            map.basemap = Basemap(mapOptions.basemap)
        } else {
            val layers = mapOptions.vectorTilesUrls.map { url -> ArcGISVectorTiledLayer(url) }

            map.basemap = Basemap(layers, null)
        }

        map.minScale = getMapScale(mapOptions.minZoom)
        map.maxScale = getMapScale(mapOptions.maxZoom)
        mapView.map = map
        mapView.graphicsOverlays.add(defaultGraphicsOverlay)

        mapView.addMapScaleChangedListener {
            val zoomLevel = getZoomLevel(mapView)

            zoomStreamHandler.addZoom(zoomLevel)
        }

        val viewPoint = Viewpoint(
            mapOptions.initialCenter.latitude, mapOptions.initialCenter.longitude,
            getMapScale(mapOptions.zoom.roundToInt()),
        )
        mapView.setViewpoint(viewPoint)

        setMapInteraction(enabled = mapOptions.isInteractive)

        setupMethodChannel()
        setupEventChannel()
    }

    override fun dispose() {}

    // region helper

    private fun setupMethodChannel() {
        methodChannel.setMethodCallHandler { call, result ->
            when (call.method) {
                "zoom_in" -> onZoomIn(call = call, result = result)
                "zoom_out" -> onZoomOut(call = call, result = result)
                "add_view_padding" -> onAddViewPadding(call = call, result = result)
                "set_interaction" -> onSetInteraction(call = call, result = result)
                "move_camera" -> onMoveCamera(call = call, result = result)
                "add_graphic" -> onAddGraphic(call = call, result = result)
                "remove_graphic" -> onRemoveGraphic(call = call, result = result)
                else -> result.notImplemented()
            }
        }
    }

    private fun setupEventChannel() {
        zoomStreamHandler = ZoomStreamHandler()

        EventChannel(binaryMessenger, "esri.arcgis.flutter_plugin/$viewId/zoom")
            .setStreamHandler(zoomStreamHandler)
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
                result.success(future.get())
            } catch (e: Exception) {
                result.error("Error", e.message, e)
            }
        }
    }

    private fun onAddViewPadding(call: MethodCall, result: MethodChannel.Result) {
        val optionParams = call.arguments as Map<String, Any>
        val viewPadding = optionParams.parseToClass<ViewPadding>()

        // https://developers.arcgis.com/android/api-reference/reference/com/esri/arcgisruntime/mapping/view/MapView.html#setViewInsets(double,double,double,double)
        mapView.setViewInsets(
            viewPadding.left,
            viewPadding.top,
            viewPadding.right,
            viewPadding.bottom
        )

        result.success(true)
    }

    private fun onSetInteraction(call: MethodCall, result: MethodChannel.Result) {
        val enabled = call.argument<Boolean>("enabled")!!

        setMapInteraction(enabled = enabled)

        result.success(true)
    }

    private fun onAddGraphic(call: MethodCall, result: MethodChannel.Result) {
        val graphicArguments = call.arguments as Map<String, Any>
        val newGraphic = GraphicsParser.parse(graphicArguments)

        defaultGraphicsOverlay.graphics.addAll(newGraphic)

        result.success(true)
    }

    private fun onRemoveGraphic(call: MethodCall, result: MethodChannel.Result) {
        val graphicId = call.arguments as String
        defaultGraphicsOverlay.graphics.removeAll { graphic ->
            val id = graphic.attributes["id"] as? String
            graphicId == id
        }

        result.success(true)
    }

    private fun onMoveCamera(call: MethodCall, result: MethodChannel.Result) {

        val arguments = call.arguments as Map<String, Any>
        val point = (arguments["point"] as Map<String, Double>).parseToClass<LatLng>()

        val zoomLevel = call.argument<Int>("zoomLevel")

        val animationOptionMap = (arguments["animationOptions"] as Map<String, Any>?)

        val animationOptions =
            if (animationOptionMap == null || animationOptionMap.isEmpty()) null
            else animationOptionMap.parseToClass<AnimationOptions>()

        val scale = if (zoomLevel != null) {
            getMapScale(zoomLevel)
        } else {
            mapView.mapScale
        }

        val initialViewPort = Viewpoint(point.latitude, point.longitude, scale)
        val future = mapView.setViewpointAsync(
            initialViewPort,
            (animationOptions?.duration?.toFloat() ?: 0F) / 1000,
            animationOptions?.animationCurve ?: AnimationCurve.LINEAR,
        )

        future.addDoneListener {
            try {
                result.success(future.get())
            } catch (e: Throwable) {
                result.error("Error", e.message, e)
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

    private fun setMapInteraction(enabled: Boolean) {
        mapView.interactionOptions.apply {
            isPanEnabled = enabled
            isFlickEnabled = enabled
            isMagnifierEnabled = enabled
            isRotateEnabled = enabled
            isZoomEnabled = enabled
            isEnabled = enabled
        }
    }

    // endregion
}


