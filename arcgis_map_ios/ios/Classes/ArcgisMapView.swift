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
            name: "esri.arcgis.flutter_plugin/\(viewId)",
            binaryMessenger: messenger
        )
        
        AGSArcGISRuntimeEnvironment.apiKey = mapOptions.apiKey
        mapView = AGSMapView.init(frame: frame)
        
        super.init()
        map.basemap = AGSBasemap(style: parseBaseMapStyle(mapOptions.basemap))
        mapView.map = map
        
        map.minScale = getMapScale(mapOptions.minZoom)
        map.maxScale = getMapScale(mapOptions.maxZoom)
        
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
        
        /*
         TODO: check if those properties are supported natively
            
         let hideDefaultZoomButtons: Bool
         let hideAttribution: Bool
         let padding: ViewPadding
         let rotationEnabled: Bool
         */
        
        
        
    
        
        /*
         TODO: at tapped we *might* need support for adding specific layers
        let layer: AGSArcGISVectorTiledLayer = {
            let url = URL(string: creationParams.tileServerUrl)!
            let layer = AGSArcGISVectorTiledLayer(url: url)
            return layer
        }()
         map.basemap = AGSBasemap.init(baseLayer: layer)
        */
        
        setupMethodChannel()
    }
    
    
    private func setupMethodChannel() {
        channel.setMethodCallHandler({ [self] (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in            
            switch(call.method) {
            case "zoom_in": onZoomIn(call, result)
            case "zoom_out": onZoomOut(call, result)
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
        let future = mapView.setViewpointScale(newScale) { _ in
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
        let future = mapView.setViewpointScale(newScale) { _ in
            result(true)
        }
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
