package dev.fluttercommunity.arcgis_map_sdk_android

import io.flutter.plugin.common.EventChannel

class ZoomStreamHandler : EventChannel.StreamHandler {
    private var sink: EventChannel.EventSink? = null
    private var lastZoomLevel: Int? = null

    fun addZoom(zoom: Int) {
        if (lastZoomLevel != zoom) {
            lastZoomLevel = zoom
            sink?.success(zoom)
        }
    }

    override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
        sink = events
    }

    override fun onCancel(arguments: Any?) {
        sink = null
    }
}