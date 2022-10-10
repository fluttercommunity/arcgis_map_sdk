package esri.arcgis.flutter_plugin

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import com.esri.arcgisruntime.geometry.*
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.mapping.view.GraphicsOverlay
import io.flutter.plugin.common.BinaryMessenger
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

    //private var mapView: MapView
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
        /*val params = creationParamMap.parseToClass<CreationParams>()

        ArcGISRuntimeEnvironment.setApiKey(params.apiKey)
        mapView = view.findViewById(R.id.mapView)*/

        //setupMap(params)
        //setupMethodChannel()
    }

    override fun dispose() {
        TODO("Not yet implemented")
    }

    private fun setupMap() {
        /* map.apply {
             operationalLayers.add(ArcGISVectorTiledLayer(params.tileServerUrl))
             addLoadStatusChangedListener(::onLoadStatusChanged)
             addBasemapChangedListener(::onBaseMapChanged)
             minScale = params.minScaleFactor
             maxScale = params.maxScaleFactor
         }

         mapView.map = map
         mapView.graphicsOverlays.add(graphicsOverlay)

         val center = params.center ?: return
         mapView.setViewpoint(Viewpoint(center.lat, center.long, mapView.mapScale))*/
    }

}


