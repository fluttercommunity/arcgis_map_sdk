package de.tollcollect.sv.smartmv.map

import androidx.annotation.NonNull
import io.flutter.embedding.engine.plugins.FlutterPlugin

/** ArcgisMapPlugin */
class ArcgisMapPlugin : FlutterPlugin {

    override fun onAttachedToEngine(@NonNull flutterPluginBinding: FlutterPlugin.FlutterPluginBinding) {
        flutterPluginBinding
            .platformViewRegistry
            .registerViewFactory(
                "<vector-map>",
                ArcgisMapViewFactory(flutterPluginBinding.binaryMessenger)
            )
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {}
}

