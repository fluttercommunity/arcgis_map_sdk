package dev.fluttercommunity.arcgis_map_sdk_android

import android.content.Context
import dev.fluttercommunity.arcgis_map_sdk_android.model.ArcgisMapOptions
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.StandardMessageCodec
import io.flutter.plugin.platform.PlatformView
import io.flutter.plugin.platform.PlatformViewFactory

class ArcgisMapViewFactory(private val binaryMessenger: BinaryMessenger) :
    PlatformViewFactory(StandardMessageCodec.INSTANCE) {
    override fun create(context: Context?, viewId: Int, args: Any?): PlatformView {
        val optionParams = args as Map<String, Any>
        val params = optionParams.parseToClass<ArcgisMapOptions>()

        return ArcgisMapView(context!!, viewId, binaryMessenger, params)
    }
}
