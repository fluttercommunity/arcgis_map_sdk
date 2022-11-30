package esri.arcgis.flutter_plugin

import io.flutter.plugin.common.EventChannel

class ZoomStreamHandler : EventChannel.StreamHandler {
    var sink: EventChannel.EventSink? = null

    fun addZoom(zoom: Int) {
        sink?.success(zoom)
    }

    override fun onListen(arguments: Any?, events: EventChannel.EventSink?) {
        sink = events
    }

    override fun onCancel(arguments: Any?) {
        sink = null
    }
}