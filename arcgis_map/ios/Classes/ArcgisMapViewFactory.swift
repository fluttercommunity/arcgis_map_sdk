//
//  VectorMapViewFactory.swift
//  Runner
//
//  Created by Julian Bissekkou on 10.05.22.
//

import Flutter
import UIKit

class ArcgisMapViewFactory: NSObject, FlutterPlatformViewFactory {
    private var messenger: FlutterBinaryMessenger
    
    init(messenger: FlutterBinaryMessenger) {
        self.messenger = messenger
        super.init()
    }
    
    func create(
        withFrame frame: CGRect,
        viewIdentifier viewId: Int64,
        arguments args: Any?
    ) -> FlutterPlatformView {
        let dict = args as! Dictionary<String, Any>
        let mapOptions: ArcgisMapOptions = try! JsonUtil.objectOfJson(dict)
        
        return ArcgisMapView(
            frame: frame,
            viewIdentifier: viewId,
            mapOptions: mapOptions,
            binaryMessenger: messenger
        )
    }
    
    public func createArgsCodec() -> FlutterMessageCodec & NSObjectProtocol {
          return FlutterStandardMessageCodec.sharedInstance()
    }
}
