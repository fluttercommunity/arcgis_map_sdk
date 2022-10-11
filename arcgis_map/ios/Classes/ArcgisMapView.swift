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
        mapOptions: ArcgisMapOptions,
        binaryMessenger messenger: FlutterBinaryMessenger
    ) {
        channel = FlutterMethodChannel(
            name: "esri.arcgis.flutter_plugin.native_view\(viewId)",
            binaryMessenger: messenger
        )
        
        AGSArcGISRuntimeEnvironment.apiKey = mapOptions.apiKey
        mapView = AGSMapView.init(frame: frame)
        
        map.basemap = AGSBasemap()
        mapView.map = map
        
    
        let viewport = AGSViewpoint(
            latitude: mapOptions.initialCenter.longitude,
            longitude: mapOptions.initialCenter.latitude,
            scale: mapOptions.zoom
        )
        mapView.setViewpoint(viewport, duration: 0) { _ in }
        map.maxExtent = AGSEnvelope(
            min: AGSPoint(x: Double(mapOptions.xMin), y: Double(mapOptions.yMin), spatialReference: .wgs84()),
            max: AGSPoint(x: Double(mapOptions.xMin), y: Double(mapOptions.yMax), spatialReference: .wgs84())
        )
        map.minScale = Double(mapOptions.minZoom)
        map.maxScale = Double(mapOptions.maxZoom)
        
        //map.basemap =
        
        /*

         let basemap: String

         let hideDefaultZoomButtons: Bool
         let hideAttribution: Bool
         let padding: ViewPadding
         let rotationEnabled: Bool
         */
        
        /*
        let layer: AGSArcGISVectorTiledLayer = {
            let url = URL(string: creationParams.tileServerUrl)!
            let layer = AGSArcGISVectorTiledLayer(url: url)
            return layer
        }()
        
        map.minScale = creationParams.minScaleFactor
        map.maxScale = creationParams.maxScaleFactor
        map.basemap = AGSBasemap.init(baseLayer: layer)
        
        
        mapView.graphicsOverlays.add(graphicsOverlay)
        
        
        guard let center = creationParams.center else { return }
        
        let viewport = AGSViewpoint(latitude: center.lat, longitude: center.long, scale: mapView.mapScale)
        mapView.setViewpoint(viewport, duration: 0) { _ in }
        
        
        */
        super.init()
        setupMethodChannel()
        
        mapErrorObservation = map.observe(\.loadError) { [weak self] (map, notifier) in
            guard let error = map.loadError else { return }
            
            DispatchQueue.main.async {
                //self?.notifyError("\(error)")
            }
        }
        
        mapLoadStatusObservation = map.observe(\.loadStatus, options: .initial) { [weak self] (map, notifier) in
            DispatchQueue.main.async {
                let status = map.loadStatus
                //self?.notifyStatus(status)
            }
        }
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
