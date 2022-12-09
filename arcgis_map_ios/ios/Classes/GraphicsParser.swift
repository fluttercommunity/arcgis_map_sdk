//
//  GraphicsParser.swift
//  arcgis_map_ios
//
//  Created by Julian Bissekkou on 09.12.22.
//

import Foundation
import ArcGIS

class GraphicsParser {
    func parse(dictionary: Dictionary<String, Any>) -> [AGSGraphic] {
        let type = dictionary["type"] as! String

        let newGraphics: [AGSGraphic]
        switch (type) {
        case "point":
            newGraphics = parsePoint(dictionary)
        case "polygon":
            newGraphics = parsePolygon(dictionary)
        case "polyline":
            newGraphics = parsePolyline(dictionary)
        default:
            fatalError("Unknown type: \(type)")
        }

        let attributes = dictionary["attributes"] as? Dictionary<String, Any>
        if let attributes = attributes {
            newGraphics.forEach {
                $0.attributes.addEntries(from: attributes)
            }
        }
        return newGraphics
    }

    private func parsePoint(_ dictionary: [String: Any]) -> [AGSGraphic] {
        let point: LatLng = try! JsonUtil.objectOfJson(dictionary["point"] as! Dictionary<String, Any>)

        let graphic = AGSGraphic()
        graphic.geometry = point.toAGSPoint()
        graphic.symbol = parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)

        return [graphic]
    }

    private func parsePolyline(_ dictionary: [String: Any]) -> [AGSGraphic] {
        let payload: PathPayload = try! JsonUtil.objectOfJson(dictionary)

        return payload.paths.map { coordinates in
            let points = coordinates.map {
                $0.toAGSPoint()
            }
            let graphic = AGSGraphic()

            graphic.geometry = AGSPolyline(points: points)
            graphic.symbol = parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)
            return graphic
        }
    }

    private func parsePolygon(_ dictionary: [String: Any]) -> [AGSGraphic] {
        let payload: PolygonPayload = try! JsonUtil.objectOfJson(dictionary)

        let graphic = AGSGraphic()

        return payload.rings.map { coordinates in
            let points = coordinates.map {
                $0.toAGSPoint()
            }
            graphic.geometry = AGSPolygon(points: points)
            graphic.symbol = parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)

            return graphic
        }
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
        let payload: SimpleFillSymbolPayload = try! JsonUtil.objectOfJson(dictionary)

        let symbol = AGSSimpleFillSymbol()
        symbol.color = payload.fillColor.toUIColor()

        let outline = AGSSimpleLineSymbol()
        outline.width = payload.outlineWidth
        outline.color = payload.outlineColor.toUIColor()
        symbol.outline = outline

        return symbol
    }

    private func parsePictureMarkerSymbol(_ dictionary: [String: Any]) -> AGSSymbol {
        let payload: PictureMarkerSymbolPayload = try! JsonUtil.objectOfJson(dictionary)

        let symbol = AGSPictureMarkerSymbol(url: URL(string: payload.url)!)
        symbol.width = payload.width
        symbol.height = payload.height
        symbol.offsetX = payload.xOffset
        symbol.offsetY = payload.yOffset

        return symbol
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
    let paths: [[LatLng]]
}

private struct PolygonPayload: Codable {
    let rings: [[LatLng]]
}