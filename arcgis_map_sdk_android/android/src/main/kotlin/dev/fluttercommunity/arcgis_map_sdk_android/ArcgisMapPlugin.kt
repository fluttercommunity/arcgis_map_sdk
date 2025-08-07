package dev.fluttercommunity.arcgis_map_sdk_android

import android.util.Log
import io.flutter.embedding.engine.plugins.FlutterPlugin

class ArcgisMapPlugin : FlutterPlugin {
    override fun onAttachedToEngine(flutterPluginBinding: FlutterPlugin.FlutterPluginBinding) {
        Log.d("JB", "Attaching to engine with binding $flutterPluginBinding")

        flutterPluginBinding
            .platformViewRegistry
            .registerViewFactory(
                "<native_map_view>",
                ArcgisMapViewFactory(flutterPluginBinding)
            )
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {}
}

