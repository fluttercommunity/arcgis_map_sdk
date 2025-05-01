import ArcGIS
import Foundation
import Flutter
import SwiftUI


class ArcgisMapView: NSObject, FlutterPlatformView {

    private let methodChannel: FlutterMethodChannel
    private let zoomEventChannel: FlutterEventChannel
    private let zoomStreamHandler = ZoomStreamHandler()
    private let centerPositionEventChannel: FlutterEventChannel
    private let centerPositionStreamHandler = CenterPositionStreamHandler()
    private let flutterPluginRegistrar: FlutterPluginRegistrar

    private var mapContentView: MapContentView
    
    private var hostingController: UIHostingController<MapContentView>
    func view() -> UIView {
        return hostingController.view
    }

    init(
            frame: CGRect,
            viewIdentifier viewId: Int64,
            mapOptions: ArcgisMapOptions,
            flutterPluginRegistrar registrar: FlutterPluginRegistrar
    ) {
        flutterPluginRegistrar = registrar
        methodChannel = FlutterMethodChannel(
                name: "dev.fluttercommunity.arcgis_map_sdk/\(viewId)",
                binaryMessenger: flutterPluginRegistrar.messenger()
        )
        zoomEventChannel = FlutterEventChannel(
                name: "dev.fluttercommunity.arcgis_map_sdk/\(viewId)/zoom",
                binaryMessenger: flutterPluginRegistrar.messenger()
        )
        zoomEventChannel.setStreamHandler(zoomStreamHandler)
        centerPositionEventChannel = FlutterEventChannel(
                name: "dev.fluttercommunity.arcgis_map_sdk/\(viewId)/centerPosition",
                binaryMessenger: flutterPluginRegistrar.messenger()
        )
        centerPositionEventChannel.setStreamHandler(centerPositionStreamHandler)

        if let apiKey = mapOptions.apiKey {
            ArcGISEnvironment.apiKey = APIKey(apiKey)
        }
        if let licenseKey = mapOptions.licenseKey {
            do {
                try ArcGISEnvironment.setLicense(with: LicenseKey(licenseKey)!)
            } catch {
                print("setLicenseKey failed. \(error)")
            }
        }
        
        let viewpoint = Viewpoint(
                latitude: mapOptions.initialCenter.latitude,
                longitude: mapOptions.initialCenter.longitude,
                scale: ArcgisMapView.convertZoomLevelToMapScale(Int(mapOptions.zoom))
        )

        mapContentView = MapContentView(mapViewModel: MapViewModel(viewpoint: viewpoint))
    
        // Embed the SwiftUI MapView into a UIHostingController
        hostingController = UIHostingController(rootView: mapContentView)
        hostingController.view.frame = frame
        hostingController.view.backgroundColor = .clear
        
        super.init()
        
        if let isAttributionTextVisible = mapOptions.isAttributionTextVisible {
            mapContentView.mapViewModel.attributionBarHidden = !isAttributionTextVisible
        }

        if mapOptions.basemap != nil {
            mapContentView.mapViewModel.map.basemap = Basemap(style: parseBaseMapStyle(mapOptions.basemap!))
        } else {
            let layers = mapOptions.vectorTilesUrls!.map { url in
                ArcGISVectorTiledLayer(url: URL(string: url)!)
            }
            mapContentView.mapViewModel.map.basemap = Basemap(baseLayers: layers)
        }

        mapContentView.mapViewModel.map.minScale = ArcgisMapView.convertZoomLevelToMapScale(mapOptions.minZoom)
        mapContentView.mapViewModel.map.maxScale = ArcgisMapView.convertZoomLevelToMapScale(mapOptions.maxZoom)

        mapContentView.mapViewModel.onScaleChanged = { [weak self] scale in
            guard let self = self else { return }
            guard !scale.isNaN else { return }
            let newZoom = self.convertScaleToZoomLevel(scale)
            self.zoomStreamHandler.addZoom(zoom: newZoom)
        }
        mapContentView.mapViewModel.onVisibleAreaChanged = { [weak self] polygon in
            guard let self = self else { return }
            let center = polygon.extent.center
            if let wgs84Center = GeometryEngine.project(center, into: .wgs84) as? Point {
                self.centerPositionStreamHandler.add(center: LatLng(latitude: wgs84Center.y, longitude: wgs84Center.x))
            }
        }

        setMapInteractive(mapOptions.isInteractive)
        setupMethodChannel()
        
        mapContentView.mapViewModel.onLoadStatusChanged = { [weak self] status in
            guard let self = self else { return }
            DispatchQueue.main.async {
                self.notifyStatus(status)
          }
        }
    }

    private func setupMethodChannel() {
        methodChannel.setMethodCallHandler({ [self] (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in
            switch (call.method) {
            case "zoom_in": onZoomIn(call, result)
            case "zoom_out": onZoomOut(call, result)
            case "rotate" : onRotate(call, result)
            case "add_view_padding": onAddViewPadding(call, result)
            case "set_interaction": onSetInteraction(call, result)
            case "move_camera": onMoveCamera(call, result)
            case "move_camera_to_points": onMoveCameraToPoints(call, result)
            case "add_graphic": onAddGraphic(call, result)
            case "remove_graphic": onRemoveGraphic(call, result)
            case "toggle_base_map" : onToggleBaseMap(call, result)
            case "retryLoad" : onRetryLoad(call, result)
            case "location_display_start_data_source" : onStartLocationDisplayDataSource(call, result)
            case "location_display_stop_data_source" : onStopLocationDisplayDataSource(call, result)
            case "location_display_set_default_symbol": onSetLocationDisplayDefaultSymbol(call, result)
            case "location_display_set_accuracy_symbol": onSetLocationDisplayAccuracySymbol(call, result)
            case "location_display_set_ping_animation_symbol" : onSetLocationDisplayPingAnimationSymbol(call, result)
            case "location_display_set_use_course_symbol_on_move" : onSetLocationDisplayUseCourseSymbolOnMove(call, result)
            case "location_display_update_display_source_position_manually" : onUpdateLocationDisplaySourcePositionManually(call, result)
            case "location_display_set_data_source_type" : onSetLocationDisplayDataSourceType(call, result)
            case "update_is_attribution_text_visible": onUpdateIsAttributionTextVisible(call, result)
            case "export_image" : onExportImage(result)
            case "set_auto_pan_mode": onSetAutoPanMode(call, result)
            case "get_auto_pan_mode": onGetAutoPanMode(call,  result)
            case "set_wander_extent_factor": onSetWanderExtentFactor( call,  result)
            case "get_wander_extent_factor": onGetWanderExtentFactor( call,  result)
            default:
                result(FlutterError(code: "Unimplemented", message: "No method matching the name \(call.method)", details: nil))
            }
        })
    }

    private func onZoomIn(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
         let currentScale = mapContentView.mapViewModel.viewpoint.targetScale

        guard let args = call.arguments as? [String: Any] else {
            result(FlutterError(code: "missing_data", message: "Invalid arguments", details: nil))
            return
        }
        
        guard let lodFactor = args["lodFactor"] as? Int else {
            result(FlutterError(code: "missing_data", message: "lodFactor not provided", details: nil))
            return
        }

        let currentZoomLevel = convertScaleToZoomLevel(currentScale)
        let totalZoomLevel = currentZoomLevel + lodFactor
        if let maxScale = mapContentView.mapViewModel.map.maxScale {
            if totalZoomLevel > convertScaleToZoomLevel(maxScale) {
                result(true)
                return
            }
        }
        let newScale = ArcgisMapView.convertZoomLevelToMapScale(totalZoomLevel)
        Task {
            do {
                await mapContentView.mapViewModel.mapViewProxy?.setViewpointScale(newScale)
                result(true)
            }
        }
    }

    private func onZoomOut(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let currentScale = mapContentView.mapViewModel.viewpoint.targetScale

        guard let args = call.arguments as? [String: Any] else {
            result(FlutterError(code: "missing_data", message: "Invalid arguments", details: nil))
            return
        }
        
        guard let lodFactor = args["lodFactor"] as? Int else {
            result(FlutterError(code: "missing_data", message: "lodFactor not provided", details: nil))
            return
        }
        
        let currentZoomLevel = convertScaleToZoomLevel(currentScale)
        let totalZoomLevel = currentZoomLevel - lodFactor
        if let minScale = mapContentView.mapViewModel.map.minScale {
            if totalZoomLevel < convertScaleToZoomLevel(minScale) {
                result(true)
                return
            }
        }
        let newScale = ArcgisMapView.convertZoomLevelToMapScale(totalZoomLevel)
        Task {
            do {
                let success = await mapContentView.mapViewModel.mapViewProxy?.setViewpointScale(newScale)
                result(success)
            }
        }
    }
    
    private func onRotate(_ call: FlutterMethodCall, _ result:@escaping FlutterResult) {
        guard let angleDouble = call.arguments as? Double else {
            result(FlutterError(code: "missing_data", message: "Invalid arguments", details: nil))
            return
        }
        Task {
            do {
                let success = await mapContentView.mapViewModel.mapViewProxy?.setViewpointRotation(angleDouble)
                result(success)
            }
        }
    }

    private func onAddViewPadding(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        guard let args = call.arguments as? [String: Any] else {
            result(FlutterError(code: "missing_data", message: "Invalid arguments", details: nil))
            return
        }
        
        do {
            let padding: ViewPadding = try JsonUtil.objectOfJson(args)

            mapContentView.mapViewModel.contentInsets = EdgeInsets(
                top: padding.top,
                leading: padding.left,
                bottom: padding.bottom,
                trailing: padding.right
            )

            result(true)
        } catch {
            result(FlutterError(code: "error", message: "Parsing data failed. Provided: \(args)", details: nil))
        }
    }

    private func onMoveCamera(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        guard let args = call.arguments as? [String: Any] else {
            result(FlutterError(code: "missing_data", message: "Invalid arguments", details: nil))
            return
        }
        Task {
            do {
                let point: LatLng = try JsonUtil.objectOfJson(args["point"] as! Dictionary<String, Any>)
                let zoomLevel = args["zoomLevel"] as? Int
                let animationDict = args["animationOptions"] as? Dictionary<String, Any>
                let animationOptions: AnimationOptions? = animationDict == nil ? nil : try JsonUtil.objectOfJson(animationDict!)
                
                let scale: Double
                
                if let zoomLevel = zoomLevel {
                    scale = ArcgisMapView.convertZoomLevelToMapScale(zoomLevel)
                } else {
                    scale = mapContentView.mapViewModel.viewpoint.targetScale
                }
                let success = await mapContentView.mapViewModel.mapViewProxy?.setViewpoint(
                    Viewpoint(center: point.toAGSPoint(), scale: scale),
                    duration: (animationOptions?.duration ?? 0) / 1000,
                )
                result(success)
            } catch {
                result(FlutterError(code: "error", message: "Error onMoveCamera. Provided: \(args)", details: nil))
            }
        }
    }

    private func onMoveCameraToPoints(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        guard let args = call.arguments as? [String: Any] else {
            result(FlutterError(code: "missing_data", message: "Invalid arguments", details: nil))
            return
        }
        Task {
            do {
                let payload: MoveToPointsPayload = try JsonUtil.objectOfJson(args)
                let polyline = Polyline(points: payload.points.map { latLng in Point(x: latLng.longitude, y:latLng.latitude, spatialReference: .wgs84) })
                
                if(payload.padding != nil) {
                    let success = try await mapContentView.mapViewModel.mapViewProxy!.setViewpointGeometry(polyline.extent, padding: payload.padding!)
                    result(success)
                } else {
                    let success = try await mapContentView.mapViewModel.mapViewProxy!.setViewpointGeometry(polyline.extent)
                    result(success)
                }
            } catch {
                result(FlutterError(code: "error", message: "Error onMoveCameraToPoints. Provided: \(args)", details: nil))
            }
        }
    }

    private func onAddGraphic(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let parser = GraphicsParser(registrar: flutterPluginRegistrar)
        var newGraphics = [Graphic]()
        do {
            newGraphics.append(contentsOf: try parser.parse(dictionary: call.arguments as! Dictionary<String, Any>))
        } catch {
            result(FlutterError(code: "unknown_error", message: "Error while adding graphic. \(error)", details: nil))
            return
        }

        
        let existingIds = mapContentView.mapViewModel.defaultGraphicsOverlay.graphics.compactMap { object in
            let graphic = object as! Graphic
            return graphic.attributes["id"] as? String
        }
        
        let hasExistingGraphics = newGraphics.contains(where: { object in
            let graphic = object
            guard let id = graphic.attributes["id"] as? String else {
                return false
            }
            
            return existingIds.contains(id)
        })
        
        if(hasExistingGraphics) {
            result(false)
            return
        }
        
        // addObjects causes an internal exceptions this is why we add
        // them in this for loop instead.
        // ArcGis is the best <3.
        newGraphics.forEach {
            mapContentView.mapViewModel.defaultGraphicsOverlay.addGraphic($0)
        }
        result(true)
    }

    private func onRemoveGraphic(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        guard let graphicId = call.arguments as? String else {
            result(FlutterError(code: "missing_data", message: "graphicId not provided", details: nil))
            return
        }
        
        let selectedGraphics = mapContentView.mapViewModel.defaultGraphicsOverlay.graphics.filter { element in
            if let graphic = element as? Graphic,
               let id = graphic.attributes["id"] as? String {
                return id == graphicId
            }
            return false
        }

        mapContentView.mapViewModel.defaultGraphicsOverlay.removeGraphics(selectedGraphics)
        result(true)
    }

    private func onToggleBaseMap(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        guard let baseMapString = call.arguments as? String else {
            result(FlutterError(code: "missing_data", message: "baseMapString not provided", details: nil))
            return
        }
        
        mapContentView.mapViewModel.map.basemap = Basemap(style: parseBaseMapStyle(baseMapString))
        result(true)
    }

    private func onRetryLoad(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        Task {
            do {
                try await mapContentView.mapViewModel.map.retryLoad()
                result(true)
            }
        }
    }

    private func notifyStatus(_ status:  LoadStatus) {
        methodChannel.invokeMethod("onStatusChanged", arguments: status.jsonValue())
    }

    private func onSetInteraction(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        guard let args = call.arguments as? [String: Any] else {
            result(FlutterError(code: "missing_data", message: "Invalid arguments", details: nil))
            return
        }
        
        guard let enabled = args["enabled"] as? Bool else {
            result(FlutterError(code: "missing_data", message: "enabled arguments", details: nil))
            return
        }
        
        setMapInteractive(enabled)
        result(true)
    }

    private func setMapInteractive(_ enabled: Bool) {
        mapContentView.mapViewModel.interactionModes = enabled ? .all : []
    }

    private func parseBaseMapStyle(_ string: String) -> Basemap.Style {
        let baseMapStyle = Basemap.Style.allCases.first { enumValue in
            enumValue.getJsonValue() == string
        }
        if baseMapStyle == nil {
            NSLog("Warning: Could not find a base map style matching the input string. Defaulting to .arcGISImageryStandard.")
        }
        return baseMapStyle ?? .arcGISImageryStandard
    }

    /**
     * Convert map scale to zoom level
     * https://developers.arcgis.com/documentation/mapping-apis-and-services/reference/zoom-levels-and-scale/#conversion-tool
     * */
    private func convertScaleToZoomLevel(_ scale: Double) -> Int {
        let result = -1.443 * log(scale) + 29.14
        return Int(result.rounded())
    }

    /**
     *  Convert zoom level to map scale
     * https://developers.arcgis.com/documentation/mapping-apis-and-services/reference/zoom-levels-and-scale/#conversion-tool
     * */
    private static func convertZoomLevelToMapScale(_ zoomLevel: Int) -> Double {
        591657527 * (exp(-0.693 * Double(zoomLevel)))
    }


    private func onStartLocationDisplayDataSource(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        
        Task {
            do {
                try await mapContentView.mapViewModel.locationDisplay.dataSource.start();
            }
            catch{
                let flutterError = FlutterError(
                    code: "generic_error",
                    message: "Failed to start data source: \(error.localizedDescription)",
                    details: nil
                )
                result(flutterError)
            }
        }
    }

    private func onStopLocationDisplayDataSource(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        Task {
            do {
                await mapContentView.mapViewModel.locationDisplay.dataSource.stop()
                result(true)
            }
        }
    }

    private func onSetLocationDisplayDefaultSymbol(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        operationWithSymbol(call, result) { mapContentView.mapViewModel.locationDisplay.defaultSymbol = $0 }
    }

    private func onSetLocationDisplayAccuracySymbol(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        operationWithSymbol(call, result) { mapContentView.mapViewModel.locationDisplay.accuracySymbol = $0 }
    }

    private func onSetLocationDisplayPingAnimationSymbol(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        operationWithSymbol(call, result) { mapContentView.mapViewModel.locationDisplay.pingAnimationSymbol = $0 }
    }

    private func onSetLocationDisplayUseCourseSymbolOnMove(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        guard let active = call.arguments as? Bool else {
            result(FlutterError(code: "missing_data", message: "Invalid arguments.", details: nil))
            return
        }

        mapContentView.mapViewModel.locationDisplay.usesCourseSymbolOnMovement = active
        result(true)
    }

    private func onUpdateLocationDisplaySourcePositionManually(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        let dataSource =  mapContentView.mapViewModel.locationDisplay.dataSource
        guard let source = dataSource as? CustomLocationDataSource<CustomLocationProvider> else {
            result(FlutterError(code: "invalid_state", message: "Expected ManualLocationDataSource but got \(dataSource)", details: nil))
            return
        }

        guard let dict = call.arguments as? Dictionary<String, Any>, let position: UserPosition = try? JsonUtil.objectOfJson(dict) else {
            result(FlutterError(code: "missing_data", message: "Expected arguments to contain data of UserPosition.", details: nil))
            return
        }

        source.currentProvider?.setNewLocation(position)
        result(true)
    }

    private func onSetAutoPanMode(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        guard let mode = call.arguments as? String else {
            result(FlutterError(code: "missing_data", message: "Invalid argument, expected an AutoPanMode as string.", details: nil))
            return
        }

        guard let autoPanMode = mode.autoPanModeFromString() else {
            result(FlutterError(code: "invalid_data", message: "Invalid argument, expected an AutoPanMode but got \(mode).", details: nil))
            return
        }

        mapContentView.mapViewModel.locationDisplay.autoPanMode = autoPanMode
        result(true)
    }
    
    private func onGetAutoPanMode(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        // autoPanMode.rawValue is any of [0; 3]:
        // https://developers.arcgis.com/ios/api-reference/_a_g_s_location_display_8h.html
        guard let stringName = mapContentView.mapViewModel.locationDisplay.autoPanMode.toName() else {
            result(FlutterError(code: "invalid_data", message: "AutoPanMode has invalid state", details: nil))
            return
        }
        return result(stringName)
    }
    
    private func onSetWanderExtentFactor(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        guard let factor = call.arguments as? Double else {
            result(FlutterError(code: "missing_data", message: "Invalid argument, expected an WanderExtentFactor as Double.", details: nil))
            return
        }
        
        mapContentView.mapViewModel.locationDisplay.wanderExtentFactor = Float(factor)
        result(true)
    }
    
    private func onGetWanderExtentFactor(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        return result(mapContentView.mapViewModel.locationDisplay.wanderExtentFactor)
    }

    private func onSetLocationDisplayDataSourceType(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        if(mapContentView.mapViewModel.locationDisplay.dataSource.status == .started) {
            result(FlutterError(code: "invalid_state", message: "Current data source is running. Make sure to stop it before setting a new data source", details: nil))
            return
        }

        guard let type = call.arguments as? String else {
            result(FlutterError(code: "missing_data", message: "Invalid argument, expected a type of data source as string.", details: nil))
            return
        }

        switch(type) {
        case "manual" :
            mapContentView.mapViewModel.locationDisplay.dataSource = CustomLocationDataSource{
                return CustomLocationProvider()
            }
            result(true)
        case "system" :
            mapContentView.mapViewModel.locationDisplay.dataSource = SystemLocationDataSource()
            result(true)
        default:
            result(FlutterError(code: "invalid_data", message: "Unknown data source type \(String(describing: type))", details: nil))
        }
    }
    
    private func onUpdateIsAttributionTextVisible(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
        guard let isVisible = call.arguments as? Bool else {
            result(FlutterError(code: "missing_data", message: "Invalid arguments", details: nil))
            return
        }
        
        mapContentView.mapViewModel.attributionBarHidden = isVisible
        result(true)
    }

    private func onExportImage(_ result: @escaping FlutterResult) {
        Task {
              do {
                  let image = try await mapContentView.mapViewModel.mapViewProxy!.exportImage()
                  if let imageData = image.pngData() {
                      result(FlutterStandardTypedData(bytes: imageData))
                  } else {
                      result(FlutterError(code: "conversion_error", message: "Failed to convert image to PNG data", details: nil))
                  }
              } catch {
                  result(FlutterError(code: "export_error", message: error.localizedDescription, details: nil))
              }
          }
    }

    private func operationWithSymbol(_ call: FlutterMethodCall, _ result: @escaping FlutterResult, handler: (Symbol) -> Void) {
        do {
            guard let args = call.arguments as? [String: Any] else {
                result(FlutterError(code: "missing_data", message: "Invalid arguments", details: nil))
                return
            }
            let symbol = try GraphicsParser(registrar: flutterPluginRegistrar).parseSymbol(args)
            handler(symbol)
            result(true)
        }
        catch {
            result(FlutterError(code: "unknown_error", message: "Error while adding graphic. \(error)", details: nil))
        }
    }
}

extension Basemap.Style: CaseIterable {
    public static var allCases: [Basemap.Style] {
        [
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

extension Basemap.Style {
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

struct MoveToPointsPayload : Codable {
    let points : [LatLng]
    let padding : Double?
}

extension LoadStatus {
    func jsonValue()  -> String {
        switch self {
        case .loaded:
            return "loaded"
        case .loading:
            return "loading"
        case .failed:
            return "failed"
        case .notLoaded:
            return "notLoaded"
        @unknown default:
            return "unknown"
        }
    }
}

extension String {
    func autoPanModeFromString() -> LocationDisplay.AutoPanMode? {
        switch self {
            case "compassNavigation":
                return .compassNavigation
            case "navigation":
                return .navigation
            case "recenter":
                return .recenter
            case "off":
                return .off
            default:
                return nil
        }
    }
}

extension LocationDisplay.AutoPanMode {
    func toName() -> String? {
        switch self {
        case .off:
            return "off"
        case .recenter:
            return "recenter"
        case .navigation:
            return "navigation"
        case .compassNavigation:
            return "compassNavigation"
        @unknown default:
            return nil
        }
    }
}
