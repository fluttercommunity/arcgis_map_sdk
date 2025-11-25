import Flutter
import UIKit

class ArcgisMapViewFactory: NSObject, FlutterPlatformViewFactory {
    private var registrar: FlutterPluginRegistrar
    
    init(registrar: FlutterPluginRegistrar) {
        self.registrar = registrar
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
            flutterPluginRegistrar: registrar
        )
    }
    
    public func createArgsCodec() -> FlutterMessageCodec & NSObjectProtocol {
        return FlutterStandardMessageCodec.sharedInstance()
    }
}
