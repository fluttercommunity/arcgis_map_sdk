//
// Created by Julian Bissekkou on 09.12.22.
//

import Foundation
import UIKit

struct MapColor: Codable {
    var red: Double
    var green: Double
    var blue: Double
    var opacity: Double
}

extension MapColor {
    func toUIColor() -> UIColor {
        UIColor(
                red: red / 255,
                green: green / 255,
                blue: blue / 255,
                alpha: opacity
        )
    }
}
