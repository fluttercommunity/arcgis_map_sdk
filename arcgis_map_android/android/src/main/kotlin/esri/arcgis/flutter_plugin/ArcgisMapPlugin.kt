package esri.arcgis.flutter_plugin

import io.flutter.embedding.engine.plugins.FlutterPlugin

class ArcgisMapPlugin : FlutterPlugin {
    lateinit var arcgisMapService: ArcgisMapService

    override fun onAttachedToEngine(flutterPluginBinding: FlutterPlugin.FlutterPluginBinding) {
        flutterPluginBinding
            .platformViewRegistry
            .registerViewFactory(
                "<native_map_view>",
                ArcgisMapViewFactory(flutterPluginBinding.binaryMessenger)
            )
        arcgisMapService =
            esri.arcgis.flutter_plugin.ArcgisMapService(flutterPluginBinding.binaryMessenger)
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        arcgisMapService.disposeExportVectorTileJobs()
    }
}

