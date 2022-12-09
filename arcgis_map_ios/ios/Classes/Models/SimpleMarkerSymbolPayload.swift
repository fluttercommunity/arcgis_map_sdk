//
// Created by Julian Bissekkou on 09.12.22.
//

import Foundation

struct SimpleMarkerSymbolPayload: Codable {
    var color: MapColor
    var size: Double
    var outlineColor: MapColor
    var outlineWidth: Double
}