//
// Created by Julian Bissekkou on 09.12.22.
//

import Foundation

struct SimpleFillSymbolPayload: Codable {
    var fillColor: MapColor
    var outlineColor: MapColor
    var outlineWidth: Double
}