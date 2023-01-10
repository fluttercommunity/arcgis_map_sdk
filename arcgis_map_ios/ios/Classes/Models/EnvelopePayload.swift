//
//  AreaOfInterestPayload.swift
//  arcgis_map_ios
//
//  Created by Julian Bissekkou on 10.01.23.
//

import Foundation
import ArcGIS

struct EnvelopePayload: Codable {
    let min: LatLng
    let max: LatLng
}

extension EnvelopePayload {
    func toAGSEnvelope() -> AGSEnvelope {
        return AGSEnvelope(min: min.toAGSPoint(), max: max.toAGSPoint())
    }
}

