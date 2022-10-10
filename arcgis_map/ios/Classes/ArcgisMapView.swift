//
//  VectorMap.swift
//  Runner
//
//  Created by Julian Bissekkou on 10.05.22.
//

import ArcGIS
import Foundation

class ArcgisMapView: NSObject, FlutterPlatformView {
    private let channel: FlutterMethodChannel
    
    private var mapView: AGSMapView
    private let map = AGSMap()
    private let graphicsOverlay = AGSGraphicsOverlay()
    private let userIndicatorGraphic = AGSGraphic()
    private let pinGraphic = AGSGraphic()
    private let routeLineGraphic = AGSGraphic()
    
    private var routeLineGraphics = [AGSGraphic]()
    
    private var routePoints = Array<AGSPoint>()
    
    private var mapLoadStatusObservation: NSKeyValueObservation?
    private var mapErrorObservation: NSKeyValueObservation?
    
    private static let defaultDuration = 0.8
    
    func view() -> UIView {
        return mapView
    }
    
    init(
        frame: CGRect,
        viewIdentifier viewId: Int64,
        arguments args: Any?,
        binaryMessenger messenger: FlutterBinaryMessenger
    ) {

        /*
        let dict = args as! Dictionary<String, Any>
        let creationParams = try! JsonUtil.objectOfJson(dict)
        
        AGSArcGISRuntimeEnvironment.apiKey = creationParams.apiKey
        
        mapView = AGSMapView.init(frame: frame)
        

        channel = FlutterMethodChannel(
            name: "esri.arcgis.flutter_plugin.native_view\(viewId)",
            binaryMessenger: messenger
        )
        
        super.init()
        setupMap(creationParams: creationParams)
        setupMethodChannel()
        
        mapErrorObservation = map.observe(\.loadError) { [weak self] (map, notifier) in
            guard let error = map.loadError else { return }
            
            DispatchQueue.main.async {
                self?.notifyError("\(error)")
            }
        }
        
        mapLoadStatusObservation = map.observe(\.loadStatus, options: .initial) { [weak self] (map, notifier) in
            DispatchQueue.main.async {
                let status = map.loadStatus
                self?.notifyStatus(status)
            }
        }*/
    }
    
    private func setupMap() {
        /*
        
        let layer: AGSArcGISVectorTiledLayer = {
            let url = URL(string: creationParams.tileServerUrl)!
            let layer = AGSArcGISVectorTiledLayer(url: url)
            return layer
        }()
        
        map.minScale = creationParams.minScaleFactor
        map.maxScale = creationParams.maxScaleFactor
        map.basemap = AGSBasemap.init(baseLayer: layer)
        
        mapView.map = map
        mapView.graphicsOverlays.add(graphicsOverlay)
        
        
        guard let center = creationParams.center else { return }
        
        let viewport = AGSViewpoint(latitude: center.lat, longitude: center.long, scale: mapView.mapScale)
        mapView.setViewpoint(viewport, duration: 0) { _ in }
         */
    }
    
    
    private func setupMethodChannel() {
        channel.setMethodCallHandler({ [self] (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in
            switch(call.method) {
            default:
                result(FlutterError(code: "Unimplemented", message: "No method matching the name\(call.method)", details: nil))
            }
        })
    }
}
