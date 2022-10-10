//
//  LatLng.swift
//  arcgis_map
//
//  Created by Julian Bissekkou on 10.10.22.
//
import ArcGIS
import Foundation


struct LatLng {
    let latitude: Double
    let longitude: Double
}

extension LatLng {
    func toAGSPoint() -> AGSPoint {
        return AGSPoint(x: self.longitude, y: self.latitude, spatialReference: .wgs84())
    }
}
