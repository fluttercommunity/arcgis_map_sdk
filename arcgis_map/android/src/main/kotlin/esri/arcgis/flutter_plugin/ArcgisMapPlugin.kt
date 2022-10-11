package esri.arcgis.flutter_plugin

import io.flutter.embedding.engine.plugins.FlutterPlugin

class ArcgisMapPlugin : FlutterPlugin {
    override fun onAttachedToEngine(flutterPluginBinding: FlutterPlugin.FlutterPluginBinding) {
        flutterPluginBinding
            .platformViewRegistry
            .registerViewFactory(
                "<vector-map>",
                ArcgisMapViewFactory(flutterPluginBinding.binaryMessenger)
            )
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {}
}

