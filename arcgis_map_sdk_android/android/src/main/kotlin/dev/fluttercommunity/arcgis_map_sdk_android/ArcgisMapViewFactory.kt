package dev.fluttercommunity.arcgis_map_sdk_android

import android.content.Context
import androidx.lifecycle.Lifecycle
import dev.fluttercommunity.arcgis_map_sdk_android.model.ArcgisMapOptions
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.plugin.common.StandardMessageCodec
import io.flutter.plugin.platform.PlatformView
import io.flutter.plugin.platform.PlatformViewFactory

class ArcgisMapViewFactory(
    private val binding: FlutterPlugin.FlutterPluginBinding,
    private val getLifecycle: () -> Lifecycle?,
) : PlatformViewFactory(StandardMessageCodec.INSTANCE) {

    override fun create(context: Context?, viewId: Int, args: Any?): PlatformView {
        val optionParams = args as Map<String, Any>
        val params = optionParams.parseToClass<ArcgisMapOptions>()

        return ArcgisMapView(context!!, viewId, params, binding, getLifecycle()!!)
    }
}
