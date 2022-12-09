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

        let attributes = dictionary["attributes"] as? Dictionary<String, Any>
        if let attributes = attributes {
            newGraphic.attributes.addEntries(from: attributes)
        }

        return newGraphic
    }

    private func parsePoint(_ dictionary: [String: Any]) -> AGSGraphic {
        let point: LatLng = try! JsonUtil.objectOfJson(dictionary["point"] as! Dictionary<String, Any>)

        let graphic = AGSGraphic()
        graphic.geometry = point.toAGSPoint()
        graphic.symbol = parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)

        return graphic
    }

    private func parsePolyline(_ dictionary: [String: Any]) -> AGSGraphic {
        let payload: PathPayload = try! JsonUtil.objectOfJson(dictionary)

        let graphic = AGSGraphic()
        let points = payload.paths.map {
            $0.toAGSPoint()
        }
        graphic.geometry = AGSPolyline(points: points)
        graphic.symbol = parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)

        return graphic
    }

    private func parsePolygon(_ dictionary: [String: Any]) -> AGSGraphic {
        let payload: PolygonPayload = try! JsonUtil.objectOfJson(dictionary)

        let graphic = AGSGraphic()

        let points = payload.rings.map {
            $0.toAGSPoint()
        }
        graphic.geometry = AGSPolygon(points: points)
        graphic.symbol = parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)


        return graphic
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
        case "simple-line":
            return parseSimpleLineSymbol(dictionary)
        default:
            fatalError("Unknown type: \(type)")
        }
    }

    private func parseSimpleMarkerSymbol(_ dictionary: [String: Any]) -> AGSSymbol {
        let payload: SimpleMarkerSymbolPayload = try! JsonUtil.objectOfJson(dictionary)

        let symbol = AGSSimpleMarkerSymbol()
        symbol.color = payload.color.toUIColor()
        symbol.size = payload.size
        symbol.outline = AGSSimpleLineSymbol(
                style: .solid,
                color: payload.outlineColor.toUIColor(),
                width: payload.outlineWidth
        )
        return symbol
    }

    private func parseSimpleFillMarkerSymbol(_ dictionary: [String: Any]) -> AGSSymbol {
        fatalError("parseSimpleFillMarkerSymbol(_:) has not been implemented")
    }

    private func parsePictureMarkerSymbol(_ dictionary: [String: Any]) -> AGSSymbol {
        fatalError("parsePictureMarkerSymbol(_:) has not been implemented")
    }

    private func parseSimpleLineSymbol(_ dictionary: [String: Any]) -> AGSSymbol {
        let payload: SimpleLineSymbolPayload = try! JsonUtil.objectOfJson(dictionary)
        let symbol = AGSSimpleLineSymbol()

        symbol.color = payload.color.toUIColor()
        symbol.markerStyle = payload.marker.style.toAGSStyle()
        symbol.markerPlacement = payload.marker.placement.toAGSStyle()
        symbol.style = payload.style.toAGSStyle()
        symbol.width = payload.width

        return symbol
    }

    // endregion
}

private struct PathPayload: Codable {
    let paths: [LatLng]
}

private struct PolygonPayload: Codable {
    let rings: [LatLng]
}