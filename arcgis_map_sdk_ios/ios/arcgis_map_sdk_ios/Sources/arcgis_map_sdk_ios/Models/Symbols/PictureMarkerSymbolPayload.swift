//
// Created by Julian Bissekkou on 09.12.22.
//

import Foundation

struct PictureMarkerSymbolPayload: Codable {
    let assetUri: String
    let width: Double
    let height: Double
    let xOffset: Double
    let yOffset: Double
}
