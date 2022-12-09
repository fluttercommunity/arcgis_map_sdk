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

        // fill from ArcGisMapAttributes attributes
        newGraphic.attributes.addEntries(from: [:])

        // if symbole is SimpleMarkerSymbol - currently only supports circle
        newGraphic.symbol = AGSSimpleMarkerSymbol(style: .circle, color: UIColor.black, size: 5)
        // if symbol is PictureMarkerSymbol
        newGraphic.symbol = AGSPictureMarkerSymbol(url: URL(string: "")!)
        // if symbol is SimpleFillSymbol - currently only supports solid?
        newGraphic.symbol = AGSSimpleFillSymbol(style: .solid, color: UIColor.black, outline: nil)
        // if symbol is SimpleLineSymbol - style is from PolylineStyle
        newGraphic.symbol = AGSSimpleLineSymbol(style: .solid, color: UIColor.black, width: 5)

        return newGraphic
    }

    private func parsePoint(_ dictionary: [String: Any]) -> AGSGraphic {
        let attributes = dictionary["attributes"] as! Dictionary<String, Any>
        //TODO parse other stuff
        let symbol = parseSymbol(dictionary["symbol"] as! Dictionary<String, Any>)
        fatalError()
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
        case "point":
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
        fatalError("parseSimpleMarkerSymbol(_:) has not been implemented")
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