//
//  ZoomStreamHandler.swift
//  arcgis_map_ios
//
//  Created by Julian Bissekkou on 30.11.22.
//

import Foundation

class ZoomStreamHandler: NSObject, FlutterStreamHandler {
    
    private var sink: FlutterEventSink?
    private var lastZoomLevel: Int?
    
    func onListen(withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink) -> FlutterError? {
        sink = events
        return nil
    }
    
    func onCancel(withArguments arguments: Any?) -> FlutterError? {
        sink = nil
        return nil
    }
    
    func addZoom(zoom: Int) {
        if(lastZoomLevel != zoom) {
            lastZoomLevel = zoom
            sink?(zoom)
        }
    }
}
