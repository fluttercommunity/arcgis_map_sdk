//
//  GraphicsParser.swift
//  arcgis_map_ios
//
//  Created by Julian Bissekkou on 09.12.22.
//

import Foundation
import ArcGIS

class GraphicsParser {
    func parse(dictionary: Dictionary<String, Any>) -> AGSGraphic {
        let type = dictionary["type"] as! String

        let newGraphic: AGSGraphic
        switch (type) {
        case "point":
            newGraphic = parsePoint(dictionary)
        case "polygon":
            newGraphic = parsePolygon(dictionary)
        case "polyline":
            newGraphic = parsePolyline(dictionary)
        default:
            fatalError("Unknown type: \(type)")
        }

        return newGraphic
    }

    private func parsePoint(_ dictionary: [String: Any]) -> AGSGraphic {
        let graphic = AGSGraphic()

        let point: LatLng = try! JsonUtil.objectOfJson(dictionary["point"] as! Dictionary<String, Any>)

        graphic.geometry = point.toAGSPoint()
        graphic.symbol = parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)
        graphic.attributes.addEntries(from: dictionary["attributes"] as! Dictionary<String, Any>)

        return graphic
    }

    private func parsePolyline(_ dictionary: [String: Any]) -> AGSGraphic {
        fatalError("parsePolyline(_:) has not been implemented")
    }

    private func parsePolygon(_ dictionary: [String: Any]) -> AGSGraphic {
        fatalError("parsePolygon(_:) has not been implemented")
    }

    // region symbol parsing

    private func parseSymbol(_ dictionary: [String: Any]) -> AGSSymbol {
        let type = dictionary["type"] as! String;
        switch (type) {
        case "simple-marker":
            return parseSimpleMarkerSymbol(dictionary)
        case "picture-marker":
            return parsePictureMarkerSymbol(dictionary)
        case "simple-fill":
            return parseSimpleFillMarkerSymbol(dictionary)
        case "simple-line'":
            return parseSimpleLineSymbol(dictionary)
        default:
            fatalError("Unknown type: \(type)")
        }
    }

    private func parseSimpleMarkerSymbol(_ dictionary: [String: Any]) -> AGSSymbol {
        let payload: SimpleMarkerSymbolPayload = try! JsonUtil.objectOfJson(dictionary)

        let symbol = AGSSimpleMarkerSymbol()
        symbol.color = payload.color.toUiColor()
        symbol.
        return symbol
    }

    private func parsePictureMarkerSymbol(_ dictionary: [String: Any]) -> AGSSymbol {
        fatalError("parsePictureMarkerSymbol(_:) has not been implemented")
    }

    private func parseSimpleFillMarkerSymbol(_ dictionary: [String: Any]) -> AGSSymbol {
        fatalError("parseSimpleFillMarkerSymbol(_:) has not been implemented")
    }

    private func parseSimpleLineSymbol(_ dictionary: [String: Any]) -> AGSSymbol {
        fatalError("parseSimpleLineSymbol(_:) has not been implemented")
    }

    // endregion
}