//
// Created by Julian Bissekkou on 09.12.22.
//

import Foundation

struct SimpleLineSymbolPayload {
    let cap: String
    let color: MapColor
    let declaredClass: String
    let join: String
    let marker: LineSymbolMarkerPayload
    let miterLimit: Double
    let style: String
    let width: Double
}

struct LineSymbolMarkerPayload: Codable {
    let color: MapColor
    let declaredClass: String
    let placement: MarkerPlacement
    let style: MarkerStyle
}

enum MarkerPlacement: String, Codable {
    case begin
    case end
    case beginEnd
}

enum MarkerStyle: String, Codable {
    case arrow
    case circle
    case square
    case diamond
    case cross
    case x
}