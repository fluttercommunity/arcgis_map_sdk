package dev.fluttercommunity.arcgis_map_sdk_android

import android.content.Context
import android.graphics.Bitmap
import android.view.LayoutInflater
import android.view.View
import com.esri.arcgisruntime.ArcGISRuntimeEnvironment
import com.esri.arcgisruntime.concurrent.ListenableFuture
import com.esri.arcgisruntime.geometry.GeometryEngine
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
import com.esri.arcgisruntime.mapping.view.LocationDisplay.AutoPanMode
import com.esri.arcgisruntime.mapping.view.LocationDisplay.AutoPanMode.*
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
import io.flutter.plugin.common.EventChannel
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.platform.PlatformView
import java.io.ByteArrayOutputStream
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
    private val binding: FlutterPluginBinding,
) : PlatformView {

    private val view: View = LayoutInflater.from(context).inflate(R.layout.vector_map_view, null)
    private var mapView: MapView
    private val map = ArcGISMap()
    private val defaultGraphicsOverlay = GraphicsOverlay()
    private val graphicsParser = GraphicsParser(binding)

    private val initialZoom: Int

    private lateinit var zoomStreamHandler: ZoomStreamHandler
    private lateinit var centerPositionStreamHandler: CenterPositionStreamHandler

    private val methodChannel =
        MethodChannel(binding.binaryMessenger, "dev.fluttercommunity.arcgis_map_sdk/$viewId")

    override fun getView(): View = view

    init {
        mapOptions.apiKey?.let(ArcGISRuntimeEnvironment::setApiKey)
        mapOptions.licenseKey?.let(ArcGISRuntimeEnvironment::setLicense)

        initialZoom = mapOptions.zoom.roundToInt()

        mapView = view.findViewById(R.id.mapView)

        mapOptions.isAttributionTextVisible?.let { mapView.isAttributionTextVisible = it }

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
            if (mapView.mapScale.isNaN()) return@addMapScaleChangedListener

            val zoomLevel = getZoomLevel(mapView)
            zoomStreamHandler.addZoom(zoomLevel)
        }

        mapView.addViewpointChangedListener {
            // The viewpoint listener is executed async which means that the map
            // can be altered when this is called. If we reload the map or dispose the map
            // we don't have a visibleArea or an extent which would throw null pointer in this case.
            val center = mapView.visibleArea?.extent?.center ?: return@addViewpointChangedListener
            val wgs84Center = GeometryEngine.project(center, SpatialReferences.getWgs84()) as? Point

            if (wgs84Center == null || wgs84Center.x.isNaN() || wgs84Center.y.isNaN()) {
                return@addViewpointChangedListener
            }

            val latLng = LatLng(longitude = wgs84Center.x, latitude = wgs84Center.y)

            centerPositionStreamHandler.add(latLng)
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
                "retryLoad" -> onRetryLoad(result = result)
                "location_display_start_data_source" -> onStartLocationDisplayDataSource(result)
                "location_display_stop_data_source" -> onStopLocationDisplayDataSource(result)
                "location_display_set_default_symbol" -> onSetLocationDisplayDefaultSymbol(
                    call,
                    result
                )

                "set_auto_pan_mode" -> onSetAutoPanMode(call = call, result = result)
                "get_auto_pan_mode" -> onGetAutoPanMode(call = call, result = result)
                "set_wander_extent_factor" -> onSetWanderExtentFactor(call = call, result = result)
                "get_wander_extent_factor" -> onGetWanderExtentFactor(call = call, result = result)
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

                "update_is_attribution_text_visible" -> onUpdateIsAttributionTextVisible(
                    call,
                    result
                )

                "export_image" -> onExportImage(result)

                else -> result.notImplemented()
            }
        }
    }

    private fun onUpdateIsAttributionTextVisible(call: MethodCall, result: MethodChannel.Result) {
        val isVisible = call.arguments as? Boolean
        if (isVisible == null) {
            result.error("invalid_argument", "isAttributionTextVisible must be a boolean", null)
            return
        }

        mapView.isAttributionTextVisible = isVisible
        result.success(true)
    }

    private fun onStartLocationDisplayDataSource(result: MethodChannel.Result) {
        result.finishWithFuture { mapView.locationDisplay.locationDataSource.startAsync() }
    }

    private fun onStopLocationDisplayDataSource(result: MethodChannel.Result) {
        result.finishWithFuture { mapView.locationDisplay.locationDataSource.stopAsync() }
    }

    private fun onSetLocationDisplayDefaultSymbol(call: MethodCall, result: MethodChannel.Result) {
        finishOperationWithSymbol(call, result) { symbol ->
            mapView.locationDisplay.defaultSymbol = symbol
        }
    }

    private fun onSetLocationDisplayAccuracySymbol(call: MethodCall, result: MethodChannel.Result) {
        finishOperationWithSymbol(call, result) { symbol ->
            mapView.locationDisplay.accuracySymbol = symbol
        }
    }

    private fun onSetLocationDisplayPingAnimationSymbol(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        finishOperationWithSymbol(call, result) { symbol ->
            mapView.locationDisplay.pingAnimationSymbol = symbol
        }
    }

    private fun onSetLocationDisplayUseCourseSymbolOnMove(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        try {
            val active = call.arguments as Boolean
            mapView.locationDisplay.isUseCourseSymbolOnMovement = active
            result.success(true)
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onUpdateLocationDisplaySourcePositionManually(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        try {
            val dataSource =
                mapView.locationDisplay.locationDataSource as ManualLocationDisplayDataSource
            val optionParams = call.arguments as Map<String, Any>
            val position = optionParams.parseToClass<UserPosition>()

            dataSource.setNewLocation(position)
            result.success(true)
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onSetAutoPanMode(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        try {
            val mode = call.arguments as String?
            if (mode == null) {
                result.error(
                    "missing_data",
                    "Invalid argument, expected an autoPanMode as string",
                    null,
                )
                return
            }
            val autoPanMode = mode.autoPanModeFromString()
            if (autoPanMode != null) {
                mapView.locationDisplay.autoPanMode = autoPanMode
                result.success(true)
            } else {
                result.error(
                    "invalid_data",
                    "Invalid argument, expected an AutoPanMode but got $mode",
                    null,
                )
            }
        } catch (e: Throwable) {
            result.finishWithError(e, "Setting AutoPanMode failed.")
        }
    }

    private fun onGetAutoPanMode(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        try {
            return result.success(
                when (mapView.locationDisplay.autoPanMode) {
                    OFF -> "off"
                    RECENTER -> "recenter"
                    NAVIGATION -> "navigation"
                    COMPASS_NAVIGATION -> "compassNavigation"
                }
            )
        } catch (e: Throwable) {
            result.finishWithError(e, "Getting AutoPanMode failed.")
        }
    }

    private fun onSetWanderExtentFactor(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        try {
            val factor = call.arguments as Double?
            if (factor == null) {
                result.error(
                    "missing_data",
                    "Invalid argument, expected an WanderExtentFactor as Float",
                    null,
                )
                return
            }
            mapView.locationDisplay.wanderExtentFactor = factor.toFloat()
            result.success(true)
        } catch (e: Throwable) {
            result.finishWithError(e, "Setting WanderExtentFactor failed.")
        }
    }

    private fun onGetWanderExtentFactor(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        return result.success(mapView.locationDisplay.wanderExtentFactor)
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

        when (call.arguments) {
            "manual" -> {
                try {
                    mapView.locationDisplay.locationDataSource = ManualLocationDisplayDataSource()
                    result.success(true)
                } catch (e: Throwable) {
                    result.finishWithError(e, info = "Setting datasource on mapview failed")
                }
            }

            "system" -> {
                try {
                    mapView.locationDisplay.locationDataSource = AndroidLocationDataSource(context)
                    result.success(true)
                } catch (e: Throwable) {
                    result.finishWithError(e, "Setting datasource on mapview failed")
                }
            }

            else -> result.error(
                "invalid_data",
                "Unknown data source type ${call.arguments}",
                null,
            )
        }

    }


    private fun setupEventChannel() {
        zoomStreamHandler = ZoomStreamHandler()
        centerPositionStreamHandler = CenterPositionStreamHandler()

        EventChannel(binding.binaryMessenger, "dev.fluttercommunity.arcgis_map_sdk/$viewId/zoom")
            .setStreamHandler(zoomStreamHandler)

        EventChannel(
            binding.binaryMessenger,
            "dev.fluttercommunity.arcgis_map_sdk/$viewId/centerPosition"
        )
            .setStreamHandler(centerPositionStreamHandler)
    }

    private fun onZoomIn(call: MethodCall, result: MethodChannel.Result) {
        if (mapView.mapScale.isNaN()) {
            result.error(
                "Error",
                "MapView.mapScale is NaN. Maybe the map is not completely loaded.",
                null
            )
            return
        }

        try {
            val lodFactor = call.argument<Int>("lodFactor")!!
            val currentZoomLevel = getZoomLevel(mapView)
            val totalZoomLevel = currentZoomLevel + lodFactor
            if (totalZoomLevel > mapOptions.maxZoom) {
                return
            }
            val newScale = getMapScale(totalZoomLevel)
            result.finishWithFuture { mapView.setViewpointScaleAsync(newScale) }
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onZoomOut(call: MethodCall, result: MethodChannel.Result) {
        if (mapView.mapScale.isNaN()) {
            result.error(
                "Error",
                "MapView.mapScale is NaN. Maybe the map is not completely loaded.",
                null
            )
            return
        }

        try {
            val lodFactor = call.argument<Int>("lodFactor")!!
            val currentZoomLevel = getZoomLevel(mapView)
            val totalZoomLevel = currentZoomLevel - lodFactor
            if (totalZoomLevel < mapOptions.minZoom) {
                return
            }
            val newScale = getMapScale(totalZoomLevel)
            result.finishWithFuture { mapView.setViewpointScaleAsync(newScale) }
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onAddViewPadding(call: MethodCall, result: MethodChannel.Result) {
        try {
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
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onSetInteraction(call: MethodCall, result: MethodChannel.Result) {
        try {
            val enabled = call.argument<Boolean>("enabled")!!
            setMapInteraction(enabled = enabled)

            result.success(true)
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onAddGraphic(call: MethodCall, result: MethodChannel.Result) {
        try {
            val graphicArguments = call.arguments as Map<String, Any>
            val newGraphic: List<Graphic> = graphicsParser.parse(graphicArguments)
            val existingIds =
                defaultGraphicsOverlay.graphics.mapNotNull { it.attributes["id"] as? String }
            val newIds = newGraphic.mapNotNull { it.attributes["id"] as? String }
            if (existingIds.any(newIds::contains)) {
                result.success(false)
                return
            }

            defaultGraphicsOverlay.graphics.addAll(newGraphic)


            when (val future = updateMap()) {
                null -> result.success(false)
                else -> result.finishWithFuture { future }
            }
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onRemoveGraphic(call: MethodCall, result: MethodChannel.Result) {
        try {
            val graphicId = call.arguments as String


            val graphicsToRemove = defaultGraphicsOverlay.graphics.filter { graphic ->
                val id = graphic.attributes["id"] as? String
                graphicId == id
            }

            // Don't use removeAll because this will not trigger a redraw.
            graphicsToRemove.forEach(defaultGraphicsOverlay.graphics::remove)

            updateMap()
            result.success(true)
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onMoveCamera(call: MethodCall, result: MethodChannel.Result) {
        try {
            val arguments = call.arguments as Map<String, Any>
            val point = (arguments["point"] as Map<String, Double>).parseToClass<LatLng>()

            val zoomLevel = call.argument<Int>("zoomLevel")

            val animationOptionMap = (arguments["animationOptions"] as Map<String, Any>?)

            val animationOptions =
                if (animationOptionMap.isNullOrEmpty()) null
                else animationOptionMap.parseToClass<AnimationOptions>()

            val scale = if (zoomLevel != null) {
                getMapScale(zoomLevel)
            } else if (!mapView.mapScale.isNaN()) {
                mapView.mapScale
            } else {
                getMapScale(initialZoom)
            }

            val initialViewPort = Viewpoint(point.latitude, point.longitude, scale)
            result.finishWithFuture {
                mapView.setViewpointAsync(
                    initialViewPort,
                    (animationOptions?.duration?.toFloat() ?: 0F) / 1000,
                    animationOptions?.animationCurve ?: AnimationCurve.LINEAR,
                )
            }
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onMoveCameraToPoints(call: MethodCall, result: MethodChannel.Result) {
        try {
            val arguments = call.arguments as Map<String, Any>
            val latLongs = (arguments["points"] as ArrayList<Map<String, Any>>)
                .map { p -> parseToClass<LatLng>(p) }

            val padding = arguments["padding"] as Double?

            val polyline = Polyline(
                PointCollection(latLongs.map { latLng ->
                    Point(
                        latLng.longitude,
                        latLng.latitude
                    )
                }),
                SpatialReferences.getWgs84()
            )

            result.finishWithFuture {
                if (padding != null) mapView.setViewpointGeometryAsync(polyline.extent, padding)
                else mapView.setViewpointGeometryAsync(polyline.extent)
            }
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onToggleBaseMap(call: MethodCall, result: MethodChannel.Result) {
        try {
            val newStyle = gson.fromJson<BasemapStyle>(
                call.arguments as String,
                object : TypeToken<BasemapStyle>() {}.type
            )
            map.basemap = Basemap(newStyle)
            result.success(true)
        } catch (e: Throwable) {
            result.finishWithError(e)
        }
    }

    private fun onRetryLoad(result: MethodChannel.Result) {
        try {
            mapView.map?.retryLoadAsync()
            result.success(true)
        } catch (e: Exception) {
            result.finishWithError(e)
        }
    }

    private fun onExportImage(result: MethodChannel.Result) {
        result.finishWithFuture(
            mapResult = { bitmap ->
                val stream = ByteArrayOutputStream()
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
                val byteArray = stream.toByteArray()
                bitmap.recycle()
                byteArray
            },
            getFuture = { mapView.exportImageAsync() }
        )

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
    private fun updateMap(): ListenableFuture<Boolean>? {
        if (mapView.mapScale.isNaN()) {
            return null
        }
        return mapView.setViewpointScaleAsync(mapView.mapScale)
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

    // region helper methods

    /**
     * Safely awaits the provide future and respond to the MethodChannel with the result
     * or an error.
     *
     * @param mapResult optional transformation of the returned value of the future. If null will default to Boolean true.
     * @param getFuture A callback that returns the future that will be awaited. This invocation is also caught.
     */
    private fun <T> MethodChannel.Result.finishWithFuture(
        mapResult: (T) -> Any = { _ -> true },
        getFuture: () -> ListenableFuture<T>
    ) {
        try {
            val future = getFuture()
            future.addDoneListener {
                try {
                    val result = future.get()
                    success(mapResult(result))
                } catch (e: Throwable) {
                    finishWithError(e)
                }
            }
        } catch (e: Throwable) {
            finishWithError(e)
        }
    }

    private fun MethodChannel.Result.finishWithError(e: Throwable, info: String? = null) {
        val msg = StringBuilder().apply {
            if (info != null) append(info)
            append(e.localizedMessage ?: e.message ?: "$e")
        }.toString()
        error("unknown_error", msg, null)
    }


    private fun finishOperationWithSymbol(
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
            result.finishWithError(e, info = "Error while adding graphic.")
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

private fun String.autoPanModeFromString() = when (this) {
    "compassNavigation" -> COMPASS_NAVIGATION
    "navigation" -> NAVIGATION
    "recenter" -> RECENTER
    "off" -> OFF
    else -> null
}
