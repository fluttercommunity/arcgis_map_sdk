//
// Created by Julian Bissekkou on 09.12.22.
//

import Foundation
import ArcGIS

struct SimpleLineSymbolPayload: Codable {
    //let cap: String
    let color: MapColor
    //let declaredClass: String
    //let join: String
    let marker: LineSymbolMarkerPayload
    let style: PolylineStyle
    let width: Double
}

struct LineSymbolMarkerPayload: Codable {
    //let color: MapColor
    //let declaredClass: String
    let placement: MarkerPlacement
    let style: MarkerStyle
}


enum PolylineStyle: String, Codable {
    case dash
    case dashDot
    case dot
    case longDash
    case longDashDot
    case longDashDotDot
    case none
    case shortDash
    case shortDashDot
    case shortDashDotDot
    case shortDot
    case solid

    func toAGSStyle() -> AGSSimpleLineSymbolStyle {
        switch (self) {
        case .dash:
            return .dash
        case .dashDot:
            return .dashDot
        case .dot:
            return .dot
        case .longDash:
            return .longDash
        case .longDashDot:
            return .longDashDot
        case .longDashDotDot:
            return .longDashDot
        case .none:
            return .null
        case .shortDash:
            return .shortDash
        case .shortDashDot:
            return .shortDashDot
        case .shortDashDotDot:
            return .shortDashDotDot
        case .shortDot:
            return .shortDot
        case .solid:
            return .solid
        }
    }
}

enum MarkerPlacement: String, Codable {
    case begin
    case end
    case beginEnd

    func toAGSStyle() -> AGSSimpleLineSymbolMarkerPlacement {
        switch (self) {
        case .begin:
            return .begin
        case .end:
            return .end
        case .beginEnd:
            return .beginAndEnd
        }
    }
}

enum MarkerStyle: String, Codable {
    case arrow
    case none

    func toAGSStyle() -> AGSSimpleLineSymbolMarkerStyle {
        switch (self) {
        case .arrow:
            return .arrow
        case .none:
            return .none
        }
    }
}