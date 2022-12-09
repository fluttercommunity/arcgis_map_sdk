//
// Created by Julian Bissekkou on 09.12.22.
//

import Foundation

struct MapColor: Codable {
    var red: Int
    var green: Int
    var blue: Int
    var opacity: Int
}

extension MapColor {
    func toUIColor() -> UIColor {
        UIColor(
                red: CGFloat(red) / 255,
                green: CGFloat(green) / 255,
                blue: CGFloat(blue) / 255,
                alpha: CGFloat(opacity)
        )
    }
}