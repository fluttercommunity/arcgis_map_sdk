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
    func toUiColor() -> UIColor {
        UIColor(red: CGFloat(red), green: CGFloat(green), blue: CGFloat(blue), alpha: CGFloat(255) * CGFloat(opacity))
    }
}