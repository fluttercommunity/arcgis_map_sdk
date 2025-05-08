package dev.fluttercommunity.arcgis_map_sdk_android

import android.content.Context
import android.content.ContextWrapper
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import dev.fluttercommunity.arcgis_map_sdk_android.model.ArcgisMapOptions
import io.flutter.embedding.engine.plugins.FlutterPlugin.FlutterPluginBinding
import io.flutter.plugin.common.StandardMessageCodec
import io.flutter.plugin.platform.PlatformView
import io.flutter.plugin.platform.PlatformViewFactory

class ArcgisMapViewFactory(
    private val flutterPluginBinding: FlutterPluginBinding,
) : PlatformViewFactory(StandardMessageCodec.INSTANCE) {
    override fun create(context: Context?, viewId: Int, args: Any?): PlatformView {
        val optionParams = args as Map<String, Any>
        val params = optionParams.parseToClass<ArcgisMapOptions>()

        return ArcgisMapView(
            context!!, viewId, params, flutterPluginBinding, getLifecycle(context)!!
        )
    }

    private fun getLifecycle(context: Context): Lifecycle? {
        var currentContext = context
        while (currentContext is ContextWrapper) {
            if (currentContext is LifecycleOwner) return currentContext.lifecycle
            currentContext = currentContext.baseContext
        }
        return null
    }
}
