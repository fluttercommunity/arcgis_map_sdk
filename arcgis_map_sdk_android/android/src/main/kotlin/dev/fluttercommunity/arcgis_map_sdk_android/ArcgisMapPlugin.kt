package dev.fluttercommunity.arcgis_map_sdk_android

import io.flutter.embedding.engine.plugins.FlutterPlugin

class ArcgisMapPlugin : FlutterPlugin {
    override fun onAttachedToEngine(flutterPluginBinding: FlutterPlugin.FlutterPluginBinding) {
        flutterPluginBinding
            .platformViewRegistry
            .registerViewFactory(
                "<native_map_view>",
                ArcgisMapViewFactory(flutterPluginBinding.binaryMessenger)
            )
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {}
}

