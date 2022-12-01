//
//  AnimationOptions.swift
//  arcgis_map_ios
//
//  Created by Julian Bissekkou on 01.12.22.
//

import Foundation
import ArcGIS

struct AnimationOptions: Codable {
    var duration: Double?
    var animationCurve: String
}

extension AnimationOptions {
    func arcgisAnimationCurve() -> AGSAnimationCurve {
        switch animationCurve {
        case "linear":
            return .linear
        case "ease-in":
            return .easeInCirc
        case "ease-out":
            return .easeOutCirc
        case "ease-in-out":
            return .easeInOutCirc
        default:
            return .linear
        }
    }
}
