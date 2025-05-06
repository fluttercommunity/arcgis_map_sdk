//
//  CenterPositionStreamHandler.swift
//  arcgis_map_sdk_ios
//
//  Created by Tarek Tolba on 06/02/2023.
//

import Foundation
import Flutter

class CenterPositionStreamHandler: NSObject, FlutterStreamHandler {

    private var sink: FlutterEventSink?

    func onListen(withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink) -> FlutterError? {
        sink = events
        return nil
    }

    func onCancel(withArguments arguments: Any?) -> FlutterError? {
        sink = nil
        return nil
    }

    func add(center: LatLng) {
        sink?(center.dictionary)
    }
}
