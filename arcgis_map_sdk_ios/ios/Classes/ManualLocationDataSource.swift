//
//  ManualLocationDataSource.swift
//  arcgis_map_sdk_ios
//
//  Created by Julian Bissekkou on 27.11.23.
//

import Foundation
import ArcGIS

class ManualLocationDataSource: AGSLocationDataSource {
    public func setNewLocation(coordinate: LatLng, accuracy: Double?, course: Double?) {
        let loc = AGSLocation(
            position: coordinate.toAGSPoint(),
            horizontalAccuracy: accuracy ?? 0,
            velocity: 0,
            course: course ?? 0,
            lastKnown: false
        )
        didUpdate(loc)
    }
}
