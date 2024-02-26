package dev.fluttercommunity.arcgis_map_sdk_android

import android.content.Context
import dev.fluttercommunity.arcgis_map_sdk_android.model.ArcgisMapOptions
import io.flutter.embedding.engine.plugins.FlutterPlugin.FlutterPluginBinding
import io.flutter.plugin.common.StandardMessageCodec
import io.flutter.plugin.platform.PlatformView
import io.flutter.plugin.platform.PlatformViewFactory
import dev.fluttercommunity.arcgis_map_sdk_android.ArcgisMapView

class ArcgisMapViewFactory(private val flutterPluginBinding: FlutterPluginBinding) :
    PlatformViewFactory(StandardMessageCodec.INSTANCE) {
    override fun create(context: Context?, viewId: Int, args: Any?): PlatformView {
        val optionParams = args as Map<String, Any>
        val params = optionParams.parseToClass<ArcgisMapOptions>()

        return ArcgisMapView(context!!, viewId, params, flutterPluginBinding)
    }
}
