import ArcGIS
import Foundation

class ArcgisMapView: NSObject, FlutterPlatformView {
    private let methodChannel: FlutterMethodChannel
    private let zoomEventChannel: FlutterEventChannel
    private let zoomStreamHandler = ZoomStreamHandler()
    
    private var mapScaleObservation: NSKeyValueObservation?
    
    private var mapView: AGSMapView
    private let map = AGSMap()
    private let graphicsOverlay = AGSGraphicsOverlay()
    private let userIndicatorGraphic = AGSGraphic()
    private let pinGraphic = AGSGraphic()
    private let routeLineGraphic = AGSGraphic()
    
    private var routeLineGraphics = [AGSGraphic]()
    
    private var routePoints = Array<AGSPoint>()
    let vectorTileCacheURL: URL
    
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
        methodChannel = FlutterMethodChannel(
            name: "esri.arcgis.flutter_plugin/\(viewId)",
            binaryMessenger: messenger
        )
        zoomEventChannel = FlutterEventChannel(
            name: "esri.arcgis.flutter_plugin/\(viewId)/zoom",
            binaryMessenger: messenger
        )
        zoomEventChannel.setStreamHandler(zoomStreamHandler)
        
        let temporaryDirectory = FileManager.default.temporaryDirectory.appendingPathComponent("tile-cache")
        try? FileManager.default.createDirectory(at: temporaryDirectory, withIntermediateDirectories: false)
        
        vectorTileCacheURL = temporaryDirectory
            .appendingPathComponent("myTileCache", isDirectory: false)
            .appendingPathExtension("vtpk")
        
        AGSArcGISRuntimeEnvironment.apiKey = mapOptions.apiKey
        mapView = AGSMapView.init(frame: frame)
        
        super.init()
        
        if mapOptions.basemap != nil {
            map.basemap = AGSBasemap(style: parseBaseMapStyle(mapOptions.basemap!))
        } else {
            if FileManager.default.fileExists(atPath: vectorTileCacheURL.path) {
                let layer = AGSArcGISVectorTiledLayer(vectorTileCache: AGSVectorTileCache(fileURL: vectorTileCacheURL))
                map.basemap = AGSBasemap(baseLayer: layer)
            } else {
                let layers = mapOptions.vectorTilesUrls!.map { url in
                    AGSArcGISVectorTiledLayer(url: URL(string: url)!)
                }
                map.basemap = AGSBasemap(baseLayers: layers, referenceLayers: nil)
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
                    self!.downloadVectorTile(mapOptions.vectorTilesUrls!.first!)
                }
            }
        }
        
        map.minScale = getMapScale(mapOptions.minZoom)
        map.maxScale = getMapScale(mapOptions.maxZoom)
        
        mapView.map = map
        mapScaleObservation = mapView.observe(\.mapScale) { [weak self] (map, notifier) in
            DispatchQueue.main.async {
                guard let self = self else { return }
                let newZoom = self.getZoomLevel(self.mapView.mapScale)
                self.zoomStreamHandler.addZoom(zoom: newZoom)
            }
        }
        
        
        let viewport = AGSViewpoint(
            latitude: mapOptions.initialCenter.latitude,
            longitude: mapOptions.initialCenter.longitude,
            // TODO(tapped): we might not be able to have zoom and scale under the same api
            // for now we just multiply it by 1000 to have a similar effect
            scale: mapOptions.zoom * 1000
        )
        mapView.setViewpoint(viewport, duration: 0) { _ in }
        
        /*
        map.maxExtent = AGSEnvelope(
            min: AGSPoint(x: Double(mapOptions.xMin), y: Double(mapOptions.yMin), spatialReference: .wgs84()),
            max: AGSPoint(x: Double(mapOptions.xMin), y: Double(mapOptions.yMax), spatialReference: .wgs84())
        )
        */
        
        setMapInteractive(mapOptions.isInteractive)
        setupMethodChannel()
    }
    
    private func setupMethodChannel() {
        methodChannel.setMethodCallHandler({ [self] (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in            
            switch(call.method) {
            case "zoom_in": onZoomIn(call, result)
            case "zoom_out": onZoomOut(call, result)
            case "add_view_padding": onAddViewPadding(call, result)
            case "set_interaction": onSetInteraction(call, result)
            case "move_camera": onMoveCamera(call, result)
            default:
                result(FlutterError(code: "Unimplemented", message: "No method matching the name\(call.method)", details: nil))
            }
        })
    }
    
    private func onZoomIn(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let lodFactor = (call.arguments! as! Dictionary<String, Any>)["lodFactor"]! as! Int
        let currentZoomLevel = getZoomLevel(mapView.mapScale)
        let totalZoomLevel = currentZoomLevel + lodFactor
        if(totalZoomLevel > getZoomLevel(map.maxScale)) {
            return
        }
        let newScale = getMapScale(totalZoomLevel)
        mapView.setViewpointScale(newScale) { _ in
            result(true)
        }
    }
    
    private func onZoomOut(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let lodFactor = (call.arguments! as! Dictionary<String, Any>)["lodFactor"]! as! Int
        let currentZoomLevel = getZoomLevel(mapView.mapScale)
        let totalZoomLevel = currentZoomLevel - lodFactor
        if(totalZoomLevel < getZoomLevel(map.minScale)) {
            return
        }
        let newScale = getMapScale(totalZoomLevel)
        mapView.setViewpointScale(newScale) { success in
            result(success)
        }
    }
    
    private func onAddViewPadding(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let dict = call.arguments as! Dictionary<String, Any>
        let padding: ViewPadding = try! JsonUtil.objectOfJson(dict)
        
        mapView.contentInset = UIEdgeInsets(
            top: padding.top,
            left: padding.left,
            bottom: padding.bottom,
            right: padding.right
        )
        
        result(true)
    }
    
    private func onMoveCamera(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let dict = call.arguments as! Dictionary<String, Any>
        let point: LatLng = try! JsonUtil.objectOfJson(dict["point"] as! Dictionary<String, Any>)
        let zoomLevel = dict["zoomLevel"] as? Int
        
        let animationDict = dict["animationOptions"] as? Dictionary<String, Any>
        let animationOptions: AnimationOptions? = animationDict == nil ? nil : try? JsonUtil.objectOfJson(animationDict!)
        
        let scale = zoomLevel != nil ? getMapScale(zoomLevel!) : mapView.mapScale
        
        mapView.setViewpoint(
            AGSViewpoint(center: point.toAGSPoint(), scale: scale),
            duration: (animationOptions?.duration ?? 0) / 1000,
            curve: animationOptions?.arcgisAnimationCurve() ?? .linear
        ) { success in
            result(success)
        }
    }
    
    private func onSetInteraction(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let enabled = (call.arguments! as! Dictionary<String, Any>)["enabled"]! as! Bool
        
        setMapInteractive(enabled)
        result(true)
    }
    
    private func setMapInteractive(_ enabled: Bool) {
        mapView.interactionOptions.isZoomEnabled = enabled
        mapView.interactionOptions.isPanEnabled = enabled
        mapView.interactionOptions.isFlickEnabled = enabled
        mapView.interactionOptions.isMagnifierEnabled = enabled
        mapView.interactionOptions.isRotateEnabled = enabled
        mapView.interactionOptions.isEnabled = enabled
    }
    
    var exportTask: AGSExportVectorTilesTask?
    var job: AGSExportVectorTilesJob?
    
    private func downloadVectorTile(_ url: String) {
        /*
         From the tutorial:
         Create an AGSArcGISVectorTiledLayer, from the map's base layers.
         Create an AGSExportVectorTilesTask using the vector tiled layer's URL.
         Create default AGSExportVectorTilesParameters from the task, specifying extent and maximum scale.
         Create an AGSExportVectorTilesJob from the task using the parameters, specifying a vector tile cache path, and an item resource path. The resource path is required if you want to export the tiles with the style.
         Start the job, and once it completes successfully, get the resulting AGSExportVectorTilesResult.
         Get the AGSVectorTileCache and AGSItemResourceCache from the result to create an AGSArcGISVectorTiledLayer that can be displayed to the map view.
         */
        
        // Set the max scale parameter to 7% of the map's scale to limit
        // number of tiles exported to within the vector tiled layer's max tile export limit.
        let maxScale = mapView.mapScale * 0.07
        // Get current area of interest marked by the extent view.
        let areaOfInterest = envelope(for: mapView)
        // Get the parameters by specifying the selected area and vector tiled layer's max scale as maxScale.
        exportTask = AGSExportVectorTilesTask(url: URL(string: url)!)
        exportTask!.load { [weak self] error in
            guard let self = self else { return }
            if let error = error {
                print("Error while loading initial export task: \(error)")
            } else {
                let vectorTileInfo = self.exportTask!.vectorTileSourceInfo
                
                print("Exporing with \(areaOfInterest.center) and maxScale: \(maxScale)")
                print("Vector tile source: \(vectorTileInfo)")
                print("Allows export: \(vectorTileInfo?.exportTilesAllowed)")
                
                self.exportTask?.defaultExportVectorTilesParameters(withAreaOfInterest: areaOfInterest, maxScale: maxScale, completion: { [weak self] parameters, error in
                    guard let self = self, let exportTask = self.exportTask else { return }
                    if let params = parameters {
                        self.exportVectorTiles(exportTask: exportTask, parameters: params)
                    }
                    else {
                        print("error: \(String(describing: error))")
                        //self.presentAlert(error: error)
                    }
                })
            }
        }
    }
    
    func exportVectorTiles(
      exportTask: AGSExportVectorTilesTask,
      parameters: AGSExportVectorTilesParameters
    ) {
        print("Creating job...")
        let job = exportTask.exportVectorTilesJob(with: parameters, downloadFileURL: vectorTileCacheURL)
        
      self.job = job
      // Start the job.
        job.start(
            statusHandler: { status in
                let progress = job.progress
                print("Job update: \(progress.fractionCompleted) -> \(progress.completedUnitCount)/\(progress.totalUnitCount)")
        }) { [weak self] (result, error) in
          print("Job done: \(result), \(error)")
          
        guard let self = self else { return }
        self.job = nil
        if let result = result,
          let tileCache = result.vectorTileCache
        {
            print("Download done: \(tileCache.fileURL)")
            print("URL: \(self.vectorTileCacheURL.path)")
            
          // Create the vector tiled layer with the tile cache and item resource cache.
            let vectorTiledLayer = AGSArcGISVectorTiledLayer(
                vectorTileCache: tileCache
            )
            
        } else if let error = error {
          let nsError = error as NSError
          if !(nsError.domain == NSCocoaErrorDomain && nsError.code == NSUserCancelledError) {
            print("Fuck: \(error)")
          }
        }
      }
    }

    
    func envelope(for view: UIView) -> AGSEnvelope {
        let frame = view.frame
        let minPoint = mapView.screen(toLocation: CGPoint(x: frame.minX, y: frame.minY))
        let maxPoint = mapView.screen(toLocation: CGPoint(x: frame.maxX, y: frame.maxY))
        let extent = AGSEnvelope(min: minPoint, max: maxPoint)
        return extent
    }
    
    private func parseBaseMapStyle(_ string: String) -> AGSBasemapStyle {
        return AGSBasemapStyle.allCases.first { enumValue in
            enumValue.getJsonValue() == string
        }!
    }
    
    /**
     * Convert map scale to zoom level
     * https://developers.arcgis.com/documentation/mapping-apis-and-services/reference/zoom-levels-and-scale/#conversion-tool
     * */
    private func getZoomLevel(_ scale: Double) -> Int {
        let result = -1.443 * log(scale) + 29.14
        return Int(result.rounded())
    }

    /**
     *  Convert zoom level to map scale
     * https://developers.arcgis.com/documentation/mapping-apis-and-services/reference/zoom-levels-and-scale/#conversion-tool
     * */
    private func getMapScale(_ zoomLevel: Int) -> Double {
        return 591657527 * (exp(-0.693 * Double(zoomLevel)))
    }
}

extension AGSBasemapStyle: CaseIterable {
    public static var allCases: [AGSBasemapStyle] {
        return [
            .arcGISImagery,
            .arcGISImageryStandard,
            .arcGISImageryLabels,
            .arcGISLightGray,
            .arcGISLightGrayBase,
            .arcGISLightGrayLabels,
            .arcGISDarkGray,
            .arcGISDarkGrayBase,
            .arcGISDarkGrayLabels,
            .arcGISNavigation,
            .arcGISNavigationNight,
            .arcGISStreets,
            .arcGISStreetsNight,
            .arcGISStreetsRelief,
            .arcGISTopographic,
            .arcGISOceans,
            .arcGISOceansBase,
            .arcGISOceansLabels,
            .arcGISTerrain,
            .arcGISTerrainBase,
            .arcGISTerrainDetail,
            .arcGISCommunity,
            .arcGISChartedTerritory,
            .arcGISColoredPencil,
            .arcGISNova,
            .arcGISModernAntique,
            .arcGISMidcentury,
            .arcGISNewspaper,
            .arcGISHillshadeLight,
            .arcGISHillshadeDark,
            .arcGISStreetsReliefBase,
            .arcGISTopographicBase,
            .arcGISChartedTerritoryBase,
            .arcGISModernAntiqueBase,
            .osmStandard,
            .osmStandardRelief,
            .osmStandardReliefBase,
            .osmStreets,
            .osmStreetsRelief,
            .osmLightGray,
            .osmLightGrayBase,
            .osmLightGrayLabels,
            .osmDarkGray,
            .osmDarkGrayBase,
            .osmDarkGrayLabels,
            .osmStreetsReliefBase
        ]
    }
}

extension AGSBasemapStyle {
    func getJsonValue() -> String? {
        switch self {
        case .arcGISImagery:
            return "arcgisImagery"
        case .arcGISImageryStandard:
            return "arcgisImageryStandard"
        case .arcGISImageryLabels:
            return "arcgisImageryLabels"
        case .arcGISLightGray:
            return "arcgisLightGray"
        case .arcGISLightGrayBase:
            return "arcgisDarkGray"
        case .arcGISLightGrayLabels:
            return nil
        case .arcGISDarkGray:
            return nil
        case .arcGISDarkGrayBase:
            return nil
        case .arcGISDarkGrayLabels:
            return nil
        case .arcGISNavigation:
            return "arcgisNavigation"
        case .arcGISNavigationNight:
            return "arcgisNavigationNight"
        case .arcGISStreets:
            return "arcgisStreets"
        case .arcGISStreetsNight:
            return "arcgisStreetsNight"
        case .arcGISStreetsRelief:
            return "arcgisStreetsRelief"
        case .arcGISTopographic:
            return "arcgisTopographic"
        case .arcGISOceans:
            return "arcgisOceans"
        case .arcGISOceansBase:
            return nil
        case .arcGISOceansLabels:
            return nil
        case .arcGISTerrain:
            return "arcgisTerrain"
        case .arcGISTerrainBase:
            return nil
        case .arcGISTerrainDetail:
            return nil
        case .arcGISCommunity:
            return "arcgisCommunity"
        case .arcGISChartedTerritory:
            return "arcgisChartedTerritory"
        case .arcGISColoredPencil:
            return "arcgisColoredPencil"
        case .arcGISNova:
            return "arcgisNova"
        case .arcGISModernAntique:
            return "arcgisModernAntique"
        case .arcGISMidcentury:
            return "arcgisMidcentury"
        case .arcGISNewspaper:
            return "arcgisNewspaper"
        case .arcGISHillshadeLight:
            return "arcgisHillshadeLight"
        case .arcGISHillshadeDark:
            return "arcgisHillshadeDark"
        case .arcGISStreetsReliefBase:
            return nil
        case .arcGISTopographicBase:
            return nil
        case .arcGISChartedTerritoryBase:
            return nil
        case .arcGISModernAntiqueBase:
            return nil
        case .osmStandard:
            return "osmStandard"
        case .osmStandardRelief:
            return "osmStandardRelief"
        case .osmStandardReliefBase:
            return "osmStreetsReliefBase"
        case .osmStreets:
            return "osmStreets"
        case .osmStreetsRelief:
            return "osmStreetsRelief"
        case .osmLightGray:
            return "osmLightGray"
        case .osmLightGrayBase:
            return nil
        case .osmLightGrayLabels:
            return nil
        case .osmDarkGray:
            return "osmDarkGray"
        case .osmDarkGrayBase:
            return nil
        case .osmDarkGrayLabels:
            return nil
        case .osmStreetsReliefBase:
            return nil
        @unknown default:
            return nil
        }
    }
}
