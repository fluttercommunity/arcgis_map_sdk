//
//  GraphicsParser.swift
//  arcgis_map_ios
//
//  Created by Julian Bissekkou on 09.12.22.
//

import Foundation
import ArcGIS

class GraphicsParser {
    func parse(dictionary: Dictionary<String, Any>) -> AGSGraphic? {
        return nil;
        /*
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
            return nil
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

        return newGraphic*/
    }

    private func parsePolyline(_ dictionary: [String: Any]) -> AGSGraphic {
        fatalError("parsePolyline(_:) has not been implemented")
    }

    private func parsePolygon(_ dictionary: [String: Any]) -> AGSGraphic {
        fatalError("parsePolygon(_:) has not been implemented")
    }

    private func parsePoint(_ dictionary: [String: Any]) -> AGSGraphic {
        fatalError("parsePoint(_:) has not been implemented")
    }
}
