import Flutter
import UIKit
import ArcGIS

public class SwiftArcgisMapPlugin: NSObject, FlutterPlugin {
        
    public static func register(with registrar: FlutterPluginRegistrar) {
        registrar.register(ArcgisMapViewFactory(messenger: registrar.messenger()), withId: "<vector-map>")
    
        let instance = SwiftArcgisMapPlugin()
        let channel = FlutterMethodChannel(
            name: "esri.arcgis.flutter_plugin",
            binaryMessenger: registrar.messenger()
        )
        registrar.addMethodCallDelegate(instance, channel: channel)
    }
    
}
