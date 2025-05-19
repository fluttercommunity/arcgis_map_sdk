//
//  LatLng.swift
//  arcgis_map_sdk_ios
//
//  Created by Julian Bissekkou on 10.10.22.
//

import ArcGIS
import Foundation


struct LatLng: Codable {
    let latitude: Double
    let longitude: Double
}

extension LatLng {
    func toAGSPoint() -> Point {
        Point(x: longitude, y: latitude, spatialReference: .wgs84)
    }
}
