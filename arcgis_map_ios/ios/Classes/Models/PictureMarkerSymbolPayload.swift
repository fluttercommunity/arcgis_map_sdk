//
// Created by Julian Bissekkou on 09.12.22.
//

import Foundation

//TODO move to own folder

struct PictureMarkerSymbolPayload: Codable {
    let url: String
    let width: Double
    let height: Double
    let xOffset: Double
    let yOffset: Double
}