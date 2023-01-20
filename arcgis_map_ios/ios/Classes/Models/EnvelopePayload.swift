//
//  AreaOfInterestPayload.swift
//  arcgis_map_ios
//
//  Created by Julian Bissekkou on 10.01.23.
//

import Foundation
import ArcGIS

struct EnvelopePayload: Codable {
    let xMin: Double
    let yMin: Double
    let xMax: Double
    let yMax: Double
}

extension EnvelopePayload {
    func toAGSEnvelope(spatialReference: AGSSpatialReference? = nil) -> AGSEnvelope {
        return AGSEnvelope(xMin: xMin, yMin: yMin, xMax: xMax, yMax: yMax, spatialReference: spatialReference)
    }
}

extension AGSEnvelope {
    func toEnvelopePayload() -> EnvelopePayload {
        return EnvelopePayload(xMin: xMin, yMin: yMin, xMax: xMax, yMax: yMax)
    }
}

