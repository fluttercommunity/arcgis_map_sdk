import Flutter
import UIKit
import ArcGIS

public class SwiftArcgisMapPlugin: NSObject, FlutterPlugin {
        
    private let arcgisService: ArcgisMapService
    
    init(arcgisService: ArcgisMapService) {
        self.arcgisService = arcgisService
    }
    
    public static func register(with registrar: FlutterPluginRegistrar) {
        registrar.register(ArcgisMapViewFactory(messenger: registrar.messenger()), withId: "<native_map_view>")
    
        let channel = FlutterMethodChannel(
            name: "esri.arcgis.flutter_plugin",
            binaryMessenger: registrar.messenger()
        )
        let instance = SwiftArcgisMapPlugin(arcgisService: ArcgisMapService(methodChannel: channel))
        
        
        registrar.addMethodCallDelegate(instance, channel: channel)
    }
    
    
    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        switch(call.method) {
            case "create_export_vector_tiles_task" : self.arcgisService.onCreateExportVectorTilesTask(call, result)
            case "start_export_vector_tiles_task_job" : self.arcgisService.onStartExportVectorTileTaskJob(call, result)
            case "cancel_export_vector_tiles_task_job" : self.arcgisService.cancelJob(call, result)
            case "cancel_export_vector_tiles_task_jobs" : self.arcgisService.cancelJobs(result)
            default: result(FlutterMethodNotImplemented)
        }
    }
}
