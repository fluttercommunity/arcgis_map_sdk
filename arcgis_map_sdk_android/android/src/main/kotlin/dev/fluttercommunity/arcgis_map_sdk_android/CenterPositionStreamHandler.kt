package dev.fluttercommunity.arcgis_map_sdk_android

import dev.fluttercommunity.arcgis_map_sdk_android.model.LatLng
import io.flutter.plugin.common.EventChannel

class CenterPositionStreamHandler : EventChannel.StreamHandler {
    private var sink: EventChannel.EventSink? = null

    fun add(center: LatLng) {
        sink?.success(toMap(center))
    }

    override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
        sink = events
    }

    override fun onCancel(arguments: Any?) {
        sink = null
    }

    fun dispose() {
        sink = null
    }
}