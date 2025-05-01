//
//  GraphicsParser.swift
//  arcgis_map_sdk_ios
//
//  Created by Julian Bissekkou on 09.12.22.
//

import Foundation
import ArcGIS
import Flutter

class GraphicsParser {
    let registrar: FlutterPluginRegistrar

    init(registrar: FlutterPluginRegistrar) {
        self.registrar = registrar
    }

    func parse(dictionary: Dictionary<String, Any>) throws -> [Graphic] {
        let type = dictionary["type"] as! String

        let newGraphics: [Graphic]
        switch (type) {
        case "point":
            newGraphics = try! parsePoint(dictionary)
        case "polygon":
            newGraphics = try! parsePolygon(dictionary)
        case "polyline":
            newGraphics = try! parsePolyline(dictionary)
        default:
            throw ParseException(message: "Unknown graphic type: \(type)")
        }

        // Apply attributes to each graphic, if present
        if let attributes = dictionary["attributes"] as? [String: Any] {
            newGraphics.forEach { graphic in
                for (key, value) in attributes {
                    graphic.setAttributeValue(value, forKey: key)
                }
            }
        }
        
        return newGraphics
    }

    private func parsePoint(_ dictionary: [String: Any]) throws -> [Graphic] {
        let point: LatLng = try! JsonUtil.objectOfJson(dictionary["point"] as! Dictionary<String, Any>)

        let graphic = Graphic()
        graphic.geometry = point.toAGSPoint()
        graphic.symbol = try! parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)

        return [graphic]
    }

    private func parsePolyline(_ dictionary: [String: Any]) throws -> [Graphic] {
        let payload: PathPayload = try! JsonUtil.objectOfJson(dictionary)

        return try payload.paths.map { coordinates in
            let points = try coordinates.map { array in
                if(array.count < 2) {
                    throw ParseException(message: "Size of coordinates need to be at least 2. Got \(array)")
                }
                if(array.count > 2) {
                    return Point(x: array[0], y: array[1], z: array[2], spatialReference: .wgs84)
                }
                return Point(x: array[0], y: array[1], spatialReference: .wgs84)
            }

            let graphic = Graphic()
            graphic.geometry = Polyline(points: points)
            graphic.symbol = try! parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)

            return graphic
        }
    }

    private func parsePolygon(_ dictionary: [String: Any]) throws -> [Graphic] {
        let payload: PolygonPayload = try! JsonUtil.objectOfJson(dictionary)

        return payload.rings.map { ring in
            let graphic = Graphic()
            let points = ring.map { coordinate in
                Point(x: coordinate[0], y: coordinate[1], spatialReference: .wgs84)
            }
            graphic.geometry = Polygon(points: points)
            graphic.symbol = try! parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)

            return graphic
        }
    }

    // region symbol parsing

    func parseSymbol(_ dictionary: [String: Any]) throws -> Symbol {
        let type = dictionary["type"] as! String;
        switch (type) {
        case "simple-marker":
            return parseSimpleMarkerSymbol(dictionary)
        case "picture-marker":
            return parsePictureMarkerSymbol(dictionary)
        case "simple-fill":
            return parseSimpleFillMarkerSymbol(dictionary)
        case "simple-line":
            return parseSimpleLineSymbol(dictionary)
        default:
            throw ParseException(message: "Unknown symbol type: \(type)")
        }
    }

    private func parseSimpleMarkerSymbol(_ dictionary: [String: Any]) -> Symbol {
        let payload: SimpleMarkerSymbolPayload = try! JsonUtil.objectOfJson(dictionary)

        let symbol = SimpleMarkerSymbol()
        symbol.color = payload.color.toUIColor()
        symbol.size = payload.size
        symbol.outline = SimpleLineSymbol(
                style: .solid,
                color: payload.outlineColor.toUIColor(),
                width: payload.outlineWidth
        )
        return symbol
    }

    private func parseSimpleFillMarkerSymbol(_ dictionary: [String: Any]) -> Symbol {
        let payload: SimpleFillSymbolPayload = try! JsonUtil.objectOfJson(dictionary)

        let symbol = SimpleFillSymbol()
        symbol.color = payload.fillColor.toUIColor()

        let outline = SimpleLineSymbol()
        outline.width = payload.outlineWidth
        outline.color = payload.outlineColor.toUIColor()
        symbol.outline = outline

        return symbol
    }

    private func parsePictureMarkerSymbol(_ dictionary: [String: Any]) -> Symbol {
        let payload: PictureMarkerSymbolPayload = try! JsonUtil.objectOfJson(dictionary)

        if(!payload.assetUri.isWebUrl()) {
            let uiImage = getFlutterUiImage(payload.assetUri)
            let symbol = PictureMarkerSymbol(image: uiImage!)
            symbol.width = payload.width
            symbol.height = payload.height
            symbol.offsetX = payload.xOffset
            symbol.offsetY = payload.yOffset
            return symbol
        }

        let symbol = PictureMarkerSymbol(url: URL(string: payload.assetUri)!)
        symbol.width = payload.width
        symbol.height = payload.height
        symbol.offsetX = payload.xOffset
        symbol.offsetY = payload.yOffset

        return symbol
    }

    private func getFlutterUiImage(_ fileName: String) -> UIImage? {
            let key = registrar.lookupKey(forAsset: fileName)
        let path = Bundle.main.path(forResource: key, ofType: nil)
        return UIImage(named: path!)
    }

    private func parseSimpleLineSymbol(_ dictionary: [String: Any]) -> Symbol {
        let payload: SimpleLineSymbolPayload = try! JsonUtil.objectOfJson(dictionary)
        let symbol = SimpleLineSymbol()
        
        if let color = payload.color {
            symbol.color = color.toUIColor()
        }
        if let marker = payload.marker {
            symbol.markerStyle = marker.style.toAGSStyle()
            symbol.markerPlacement = marker.placement.toAGSStyle()
        }

        symbol.style = payload.style.toAGSStyle()
        symbol.width = payload.width

        return symbol
    }

    // endregion
}

private struct PathPayload: Codable {
    let paths: [[[Double]]]
}

private struct PolygonPayload: Codable {
    let rings: [[[Double]]]
}

extension String {
    func isWebUrl()-> Bool {
        return starts(with: "https://") || starts(with: "http://")
    }
}
