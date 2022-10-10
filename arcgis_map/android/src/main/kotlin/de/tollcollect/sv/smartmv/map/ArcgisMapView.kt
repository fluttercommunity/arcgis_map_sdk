package de.tollcollect.sv.smartmv.map

import android.content.Context
import android.graphics.drawable.BitmapDrawable
import android.view.LayoutInflater
import android.view.View
import androidx.core.content.ContextCompat
import com.esri.arcgisruntime.ArcGISRuntimeEnvironment
import com.esri.arcgisruntime.concurrent.ListenableFuture
import com.esri.arcgisruntime.geometry.*
import com.esri.arcgisruntime.layers.ArcGISVectorTiledLayer
import com.esri.arcgisruntime.loadable.LoadStatus.*
import com.esri.arcgisruntime.loadable.LoadStatusChangedEvent
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.Viewpoint
import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.mapping.view.GraphicsOverlay
import com.esri.arcgisruntime.mapping.view.MapView
import com.esri.arcgisruntime.symbology.PictureMarkerSymbol
import com.esri.arcgisruntime.symbology.SimpleLineSymbol
import com.esri.arcgisruntime.symbology.SimpleMarkerSymbol
import de.tollcollect.sv.smartmv.map.decoder.CgDecoder
import de.tollcollect.sv.smartmv.map.model.route.DrawRoutePayload
import de.tollcollect.sv.smartmv.map.model.toPoint
import de.tollcollect.sv.smartmv.map.model.view.*
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
    creationParamMap: Map<String, Any>,
) : PlatformView {

    companion object {
        private const val defaultDuration: Float = 0.8f
    }

    private val view: View = LayoutInflater.from(context).inflate(R.layout.vector_map_view, null)

    private var mapView: MapView
    private val map = ArcGISMap()
    private val graphicsOverlay = GraphicsOverlay()
    private val userIndicatorGraphic = Graphic()
    private val routeLineGraphic = Graphic()
    private val pinGraphic = Graphic()

    private var routeLineGraphics = listOf<Graphic>()

    private val routePoints = mutableListOf<Point>()

    private val methodChannel =
        MethodChannel(binaryMessenger, "de.tollcollect.sv.smartmv/native_map_view_$viewId")

    override fun getView(): View = view

    init {
        val params = creationParamMap.parseToClass<CreationParams>()

        ArcGISRuntimeEnvironment.setApiKey(params.apiKey)
        mapView = view.findViewById(R.id.mapView)

        setupMap(params)
        setupMethodChannel()
    }

    override fun dispose() {
        map.removeLoadStatusChangedListener(::onLoadStatusChanged)
        mapView.dispose()
    }

    // region event channel functions

    private fun onSetUserLocation(call: MethodCall, result: MethodChannel.Result) {
        val userLocation =
            (call.arguments as Map<String, Any>).parseToClass<UserLocation>()

        val coordinate = userLocation.coordinate

        val outerColorHex = userLocation.indicatorOuterColor.toHexInt()
        val innerColorHex = userLocation.indicatorInnerColor.toHexInt()
        val pointSymbol = SimpleMarkerSymbol(
            SimpleMarkerSymbol.Style.CIRCLE, // type
            innerColorHex, // color
            15f, // size
        ).apply { outline = SimpleLineSymbol(SimpleLineSymbol.Style.SOLID, outerColorHex, 3f) }


        userIndicatorGraphic.apply {
            geometry = coordinate.toPoint()
            symbol = pointSymbol
        }

        graphicsOverlay.graphics.remove(userIndicatorGraphic)
        graphicsOverlay.graphics.add(userIndicatorGraphic)

        if (userLocation.focusViewport) {
            val duration = (userLocation.animationDurationMilliseconds / 1000).toFloat()
            val initialViewPort = Viewpoint(coordinate.lat, coordinate.long, mapView.mapScale)
            mapView
                .setViewpointAsync(initialViewPort, duration)
                .addDoneListener { result.success(true) }
        } else {
            result.success(true)
        }
    }

    private fun onRemoveRoute(call: MethodCall, result: MethodChannel.Result) {
        graphicsOverlay.graphics.removeAll(routeLineGraphics)
        routeLineGraphics = emptyList()

        result.success(true)
    }

    private fun onDrawRouteAndCenter(call: MethodCall, result: MethodChannel.Result) {
        val payload = (call.arguments as Map<String, Any>).parseToClass<DrawRoutePayload>()

        val edges = payload.edges

        graphicsOverlay.graphics.removeAll(routeLineGraphics)

        routeLineGraphics = edges.map { route ->
            val coordinates = CgDecoder.decode(route.compressedGeometry)
            val lineColor = route.edgeColor.toHexInt()

            val points = coordinates.map { it.toPoint() }

            val lineGraphic = Graphic().apply {
                symbol = SimpleLineSymbol(SimpleLineSymbol.Style.SOLID, lineColor, 3f)
                geometry = Polyline(PointCollection(points))
            }

            lineGraphic
        }

        graphicsOverlay.graphics.addAll(routeLineGraphics)

        val envelopeData = payload.envelope
        if (envelopeData == null) {
            result.success(true)
            return
        }

        val envelope = Envelope(
            envelopeData.xmin,
            envelopeData.ymin,
            envelopeData.xmax,
            envelopeData.ymax,
            SpatialReferences.getWgs84()
        )

        mapView.setViewpointAsync(Viewpoint(envelope), defaultDuration)
            .addDoneListener { result.success(true) }
    }

    private fun onAppendToUserRoute(call: MethodCall, result: MethodChannel.Result) {
        val payload =
            (call.arguments as Map<String, Any>).parseToClass<AppendToUserRoute>()
        val lineColorHex = payload.lineColor.toHexInt()
        routePoints.addAll(payload.coordinates.map { it.toPoint() })


        routeLineGraphic.apply {
            symbol = SimpleLineSymbol(SimpleLineSymbol.Style.SOLID, lineColorHex, 3f)
            geometry = Polyline(PointCollection(routePoints))
        }

        graphicsOverlay.graphics.remove(routeLineGraphic)
        graphicsOverlay.graphics.add(routeLineGraphic)

        result.success(true)
    }

    private fun onSetScaleFactor(call: MethodCall, result: MethodChannel.Result) {
        val params = (call.arguments as Map<String, Any>).parseToClass<SetScaleFactorParams>()

        val viewport = mapView.getCurrentViewpoint(Viewpoint.Type.CENTER_AND_SCALE)

        val listener: ListenableFuture<Boolean> = if (viewport == null) {
            mapView.setViewpointScaleAsync(params.scaleFactor)
        } else {
            // We are able to cast the result as [Point] since we set the type to [CENTER_AND_SCALE].
            // Only in the case that the type is set to centerAndScale, the type is a point
            val center = viewport.targetGeometry as Point

            val duration = params.animationDurationMilliseconds
            val viewpoint = Viewpoint(
                Point(center.x, center.y, center.spatialReference),
                params.scaleFactor
            )
            mapView.setViewpointAsync(viewpoint, (duration / 1000).toFloat())
        }

        listener.addDoneListener {
            result.success(true)
        }
    }

    private fun onSetPinAndCenter(call: MethodCall, result: MethodChannel.Result) {
        val payload = (call.arguments as Map<String, Any>).parseToClass<SetPinPayload>()
        val coordinate = payload.coordinate


        val drawable = ContextCompat.getDrawable(
            mapView.context,
            R.drawable.ic_map_marker_black_48dp
        ) as BitmapDrawable

        val createMarkerFuture = PictureMarkerSymbol.createAsync(drawable)
        createMarkerFuture.addDoneListener {
            val markerSymbol = createMarkerFuture.get().apply {
                height = 48f
                width = 48f
            }
            markerSymbol.offsetY = (drawable.bitmap.height / 2).toFloat()

            pinGraphic.symbol = markerSymbol
            pinGraphic.geometry = coordinate.toPoint()

            graphicsOverlay.graphics.remove(pinGraphic)
            graphicsOverlay.graphics.add(pinGraphic)

            val viewport = Viewpoint(coordinate.lat, coordinate.long, payload.scaleFactor)
            mapView
                .setViewpointAsync(viewport, defaultDuration)
                .addDoneListener { result.success(true) }
        }
    }

    private fun onRemovePin(call: MethodCall, result: MethodChannel.Result) {
        graphicsOverlay.graphics.remove(pinGraphic)
        mapView.invalidate() // redraw view
        result.success(true)
    }

    // endregion

    // region helper

    private fun setupMap(params: CreationParams) {
        map.apply {
            operationalLayers.add(ArcGISVectorTiledLayer(params.tileServerUrl))
            addLoadStatusChangedListener(::onLoadStatusChanged)
            addBasemapChangedListener(::onBaseMapChanged)
            minScale = params.minScaleFactor
            maxScale = params.maxScaleFactor
        }

        mapView.map = map
        mapView.graphicsOverlays.add(graphicsOverlay)

        val center = params.center ?: return
        mapView.setViewpoint(Viewpoint(center.lat, center.long, mapView.mapScale))
    }

    private fun onBaseMapChanged(event: ArcGISMap.BasemapChangedEvent?) {
        val error = event?.source?.loadError ?: return
        val errorString = """
            Error: $error
            ErrorCode: ${error.errorCode}
            ErrorDomain: ${error.errorDomain}
            Message: ${error.localizedMessage}
        """.trimIndent()

        methodChannel.invokeMethod("onError", errorString)
    }

    private fun onLoadStatusChanged(event: LoadStatusChangedEvent?) {
        if (event == null) return
        methodChannel.invokeMethod("onStatusChanged", event.jsonValue())
    }

    private fun setupMethodChannel() {
        methodChannel.setMethodCallHandler { call, result ->
            when (call.method) {
                "set_user_location" -> onSetUserLocation(call = call, result = result)
                "append_to_user_route" -> onAppendToUserRoute(call = call, result = result)
                "set_scale_factor" -> onSetScaleFactor(call = call, result = result)
                "set_pin_and_center" -> onSetPinAndCenter(call = call, result = result)
                "remove_pin" -> onRemovePin(call = call, result = result)
                "draw_route_and_center" -> onDrawRouteAndCenter(call = call, result = result)
                "remove_route" -> onRemoveRoute(call = call, result = result)
                else -> result.notImplemented()
            }
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

