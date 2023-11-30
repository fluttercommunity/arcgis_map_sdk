package dev.fluttercommunity.arcgis_map_sdk_android

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import com.esri.arcgisruntime.ArcGISRuntimeEnvironment
import com.esri.arcgisruntime.geometry.Geometry
import com.esri.arcgisruntime.geometry.GeometryEngine
import com.esri.arcgisruntime.geometry.Multipoint
import com.esri.arcgisruntime.geometry.Point
import com.esri.arcgisruntime.geometry.PointCollection
import com.esri.arcgisruntime.geometry.Polyline
import com.esri.arcgisruntime.geometry.SpatialReferences
import com.esri.arcgisruntime.layers.ArcGISVectorTiledLayer
import com.esri.arcgisruntime.loadable.LoadStatus.FAILED_TO_LOAD
import com.esri.arcgisruntime.loadable.LoadStatus.LOADED
import com.esri.arcgisruntime.loadable.LoadStatus.LOADING
import com.esri.arcgisruntime.loadable.LoadStatus.NOT_LOADED
import com.esri.arcgisruntime.loadable.LoadStatusChangedEvent
import com.esri.arcgisruntime.location.AndroidLocationDataSource
import com.esri.arcgisruntime.location.LocationDataSource
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.Basemap
import com.esri.arcgisruntime.mapping.BasemapStyle
import com.esri.arcgisruntime.mapping.Viewpoint
import com.esri.arcgisruntime.mapping.view.AnimationCurve
import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.mapping.view.GraphicsOverlay
import com.esri.arcgisruntime.mapping.view.MapView
import com.esri.arcgisruntime.symbology.Symbol
import com.google.gson.reflect.TypeToken
import dev.fluttercommunity.arcgis_map_sdk_android.model.AnimationOptions
import dev.fluttercommunity.arcgis_map_sdk_android.model.ArcgisMapOptions
import dev.fluttercommunity.arcgis_map_sdk_android.model.LatLng
import dev.fluttercommunity.arcgis_map_sdk_android.model.UserPosition
import dev.fluttercommunity.arcgis_map_sdk_android.model.ViewPadding
import dev.fluttercommunity.arcgis_map_sdk_android.util.GraphicsParser
import io.flutter.embedding.engine.plugins.FlutterPlugin.FlutterPluginBinding
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
    private val context: Context,
    private val viewId: Int,
    private val mapOptions: ArcgisMapOptions,
    val binding: FlutterPluginBinding,
) : PlatformView {

    private val view: View = LayoutInflater.from(context).inflate(R.layout.vector_map_view, null)
    private var mapView: MapView
    private val map = ArcGISMap()
    private val defaultGraphicsOverlay = GraphicsOverlay()
    private val graphicsParser = GraphicsParser(binding)

    private lateinit var zoomStreamHandler: ZoomStreamHandler
    private lateinit var centerPositionStreamHandler: CenterPositionStreamHandler

    private val methodChannel =
        MethodChannel(binding.binaryMessenger, "dev.fluttercommunity.arcgis_map_sdk/$viewId")

    override fun getView(): View = view

    init {
        mapOptions.apiKey?.let(ArcGISRuntimeEnvironment::setApiKey)
        mapOptions.licenseKey?.let(ArcGISRuntimeEnvironment::setLicense)

        mapView = view.findViewById(R.id.mapView)

        map.apply {

            basemap = if (mapOptions.basemap != null) {
                Basemap(mapOptions.basemap)
            } else {
                val layers = mapOptions.vectorTilesUrls.map { url -> ArcGISVectorTiledLayer(url) }
                Basemap(layers, null)
            }

            minScale = getMapScale(mapOptions.minZoom)
            maxScale = getMapScale(mapOptions.maxZoom)
            addLoadStatusChangedListener(::onLoadStatusChanged)
        }

        mapView.map = map
        mapView.graphicsOverlays.add(defaultGraphicsOverlay)

        mapView.addMapScaleChangedListener {
            val zoomLevel = getZoomLevel(mapView)

            zoomStreamHandler.addZoom(zoomLevel)
        }
        mapView.addViewpointChangedListener {
            val center = mapView.visibleArea.extent.center
            val wgs84Center =
                    GeometryEngine.project(center, SpatialReferences.getWgs84()) as Point
            centerPositionStreamHandler.add(
                    LatLng(
                            longitude = wgs84Center.x,
                            latitude = wgs84Center.y
                    )
            )
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

    private fun onLoadStatusChanged(event: LoadStatusChangedEvent?) {
        if (event == null) return
        methodChannel.invokeMethod("onStatusChanged", event.jsonValue())
    }

    override fun dispose() {
        map.removeLoadStatusChangedListener(::onLoadStatusChanged)
        mapView.dispose()
    }

    // region helper

    private fun setupMethodChannel() {
        methodChannel.setMethodCallHandler { call, result ->
            when (call.method) {
                "zoom_in" -> onZoomIn(call = call, result = result)
                "zoom_out" -> onZoomOut(call = call, result = result)
                "add_view_padding" -> onAddViewPadding(call = call, result = result)
                "set_interaction" -> onSetInteraction(call = call, result = result)
                "move_camera" -> onMoveCamera(call = call, result = result)
                "move_camera_to_points" -> onMoveCameraToPoints(call = call, result = result)
                "add_graphic" -> onAddGraphic(call = call, result = result)
                "remove_graphic" -> onRemoveGraphic(call = call, result = result)
                "toggle_base_map" -> onToggleBaseMap(call = call, result = result)
                "reload" -> onReload(result = result)
                "location_display_start_data_source" -> onStartLocationDisplayDataSource(result)
                "location_display_stop_data_source" -> onStopLocationDisplayDataSource(result)
                "location_display_set_default_symbol" -> onSetLocationDisplayDefaultSymbol(
                    call,
                    result
                )

                "location_display_set_accuracy_symbol" -> onSetLocationDisplayAccuracySymbol(
                    call,
                    result
                )

                "location_display_set_ping_animation_symbol" -> onSetLocationDisplayPingAnimationSymbol(
                    call,
                    result
                )

                "location_display_set_use_course_symbol_on_move" -> onSetLocationDisplayUseCourseSymbolOnMove(
                    call,
                    result
                )

                "location_display_update_display_source_position_manually" -> onUpdateLocationDisplaySourcePositionManually(
                    call,
                    result
                )

                "location_display_set_data_source_type" -> onSetLocationDisplayDataSourceType(
                    call,
                    result
                )

                else -> result.notImplemented()
            }
        }
    }

    private fun onStartLocationDisplayDataSource(result: MethodChannel.Result) {
        val future = mapView.locationDisplay.locationDataSource.startAsync()
        future.addDoneListener {
            try {
                result.success(future.get())
            } catch (e: Exception) {
                result.error("Error", e.message, null)
            }
        }
    }

    private fun onStopLocationDisplayDataSource(result: MethodChannel.Result) {
        val future = mapView.locationDisplay.locationDataSource.stopAsync()
        future.addDoneListener {
            try {
                result.success(future.get())
            } catch (e: Exception) {
                result.error("Error", e.message, null)
            }
        }
    }

    private fun onSetLocationDisplayDefaultSymbol(call: MethodCall, result: MethodChannel.Result) {
        operationWithSymbol(call, result) { symbol ->
            mapView.locationDisplay.defaultSymbol = symbol
        }
    }

    private fun onSetLocationDisplayAccuracySymbol(call: MethodCall, result: MethodChannel.Result) {
        operationWithSymbol(call, result) { symbol ->
            mapView.locationDisplay.accuracySymbol = symbol
        }
    }

    private fun onSetLocationDisplayPingAnimationSymbol(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        operationWithSymbol(call, result) { symbol ->
            mapView.locationDisplay.pingAnimationSymbol = symbol
        }
    }

    private fun onSetLocationDisplayUseCourseSymbolOnMove(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        val active = call.arguments as? Boolean
        if (active == null) {
            result.error("missing_data", "Invalid arguments.", null)
            return
        }

        mapView.locationDisplay.isUseCourseSymbolOnMovement = active
        result.success(true)
    }

    private fun onUpdateLocationDisplaySourcePositionManually(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        val dataSource =
            mapView.locationDisplay.locationDataSource as? ManualLocationDisplayDataSource
        if (dataSource == null) {
            result.error(
                "invalid_state",
                "Expected ManualLocationDataSource but got $dataSource",
                null
            )
            return
        }

        val optionParams = call.arguments as Map<String, Any>
        val position = optionParams.parseToClass<UserPosition>()

        dataSource.setNewLocation(position)
        result.success(true)
    }

    private fun onSetLocationDisplayDataSourceType(call: MethodCall, result: MethodChannel.Result) {
        if (mapView.locationDisplay.locationDataSource.status == LocationDataSource.Status.STARTED) {
            result.error(
                "invalid_state",
                "Current data source is running. Make sure to stop it before setting a new data source",
                null
            )
            return
        }

        when (call.arguments as String) {
            "manual" -> {
                mapView.locationDisplay.locationDataSource = ManualLocationDisplayDataSource()
                result.success(true)
            }

            "system" -> {
                mapView.locationDisplay.locationDataSource = AndroidLocationDataSource(context)
                result.success(true)
            }

            else -> result.error("invalid_data", "Unknown data source type ${call.arguments}", null)
        }
    }


    private fun operationWithSymbol(
        call: MethodCall,
        result: MethodChannel.Result,
        function: (Symbol) -> Unit
    ) {
        try {
            val map = call.arguments as Map<String, Any>
            val symbol = graphicsParser.parseSymbol(map)
            function(symbol)
            result.success(true)
        } catch (e: Throwable) {
            result.error("unknown_error", "Error while adding graphic. $e)", null)
            return
        }
    }

    private fun setupEventChannel() {
        zoomStreamHandler = ZoomStreamHandler()
        centerPositionStreamHandler = CenterPositionStreamHandler()

        EventChannel(binding.binaryMessenger, "dev.fluttercommunity.arcgis_map_sdk/$viewId/zoom")
            .setStreamHandler(zoomStreamHandler)

        EventChannel(binding.binaryMessenger, "dev.fluttercommunity.arcgis_map_sdk/$viewId/centerPosition")
            .setStreamHandler(centerPositionStreamHandler)
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
        lateinit var newGraphic: List<Graphic>
        try {
            newGraphic = graphicsParser.parse(graphicArguments)
        } catch (e: Throwable) {
            result.error("unknown_error", "Error while adding graphic. $e)", null)
            return
        }

        val existingIds =
                defaultGraphicsOverlay.graphics.mapNotNull { it.attributes["id"] as? String }
        val newIds = newGraphic.mapNotNull { it.attributes["id"] as? String }

        if (existingIds.any(newIds::contains)) {
            result.success(false)
            return
        }

        defaultGraphicsOverlay.graphics.addAll(newGraphic)

        updateMap()

        result.success(true)
    }

    private fun onRemoveGraphic(call: MethodCall, result: MethodChannel.Result) {
        val graphicId = call.arguments as String


        val graphicsToRemove = defaultGraphicsOverlay.graphics.filter { graphic ->
            val id = graphic.attributes["id"] as? String
            graphicId == id
        }

        // Don't use removeAll because this will not trigger a redraw.
        graphicsToRemove.forEach(defaultGraphicsOverlay.graphics::remove)

        updateMap()
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

    private fun onMoveCameraToPoints(call: MethodCall, result: MethodChannel.Result) {
        val arguments = call.arguments as Map<String, Any>
        val latLongs = (arguments["points"] as ArrayList<Map<String, Any>>)
                .map { p -> parseToClass<LatLng>(p) }

        val padding = arguments["padding"] as Double?

        val polyline = Polyline(
                PointCollection(latLongs.map { latLng -> Point(latLng.longitude, latLng.latitude) }),
                SpatialReferences.getWgs84()
        )

        val future = if (padding != null) mapView.setViewpointGeometryAsync(polyline.extent, padding)
        else mapView.setViewpointGeometryAsync(polyline.extent)

        future.addDoneListener {
            try {
                result.success(future.get())
            } catch (e: Exception) {
                result.error("Error", e.message, e)
            }
        }
    }

    private fun onToggleBaseMap(call: MethodCall, result: MethodChannel.Result) {
        val newStyle = gson.fromJson<BasemapStyle>(
                call.arguments as String,
                object : TypeToken<BasemapStyle>() {}.type
        )
        map.basemap = Basemap(newStyle)
        result.success(true)
    }

    private fun onReload(result: MethodChannel.Result) {
        mapView.map.retryLoadAsync()
        result.success(true)
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
     * Adding a new graphic to the map will not trigger a redraw.
     * To be more specific [MapView.graphicsOverlays.add] does not refresh the map until the user moves the viewpoint.
     * This method will trigger a redraw by setting the same viewpoint again.
     * The corresponding issue in the esri forum can be found here:
     * https://community.esri.com/t5/arcgis-runtime-sdk-for-android-questions/mapview-graphicsoverlays-add-does-not-update-the/m-p/1240825#M5931
     */
    private fun updateMap() {
        mapView.setViewpointScaleAsync(mapView.mapScale)
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
            // don't set "isMagnifierEnabled" since we don't want to use this feature
            isPanEnabled = enabled
            isFlickEnabled = enabled
            isRotateEnabled = enabled
            isZoomEnabled = enabled
            isEnabled = enabled
        }
    }

    // endregion
}

private fun LoadStatusChangedEvent.jsonValue() = when (newLoadStatus) {
    LOADED -> "loaded"
    LOADING -> "loading"
    FAILED_TO_LOAD -> "failedToLoad"
    NOT_LOADED -> "notLoaded"
    else -> "unknown"
}

