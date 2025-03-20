//
//  AnimationOptions.swift
//  arcgis_map_sdk_ios
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
        case "easeIn":
            return .easeInCirc
        case "easeOut":
            return .easeOutCirc
        case "easeInOut":
            return .easeInOutCirc
        default:
            return .linear
        }
    }
}
