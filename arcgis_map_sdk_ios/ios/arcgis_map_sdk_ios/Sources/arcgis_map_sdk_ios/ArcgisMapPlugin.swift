import Flutter
import UIKit
import ArcGIS

public class ArcgisMapPlugin: NSObject, FlutterPlugin {
    public static func register(with registrar: FlutterPluginRegistrar) {
        registrar.register(ArcgisMapViewFactory(registrar: registrar), withId: "<native_map_view>")

        let instance = ArcgisMapPlugin()
        let channel = FlutterMethodChannel(
                name: "dev.fluttercommunity.arcgis_map_sdk",
                binaryMessenger: registrar.messenger()
        )
        registrar.addMethodCallDelegate(instance, channel: channel)
    }
}
