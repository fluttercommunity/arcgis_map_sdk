//
//  ManualLocationDataSource.swift
//  arcgis_map_sdk_ios
//
//  Created by Julian Bissekkou on 27.11.23.
//

import Foundation
import ArcGIS

final class CustomLocationProvider: LocationProvider {
    private var locationContinuation: AsyncThrowingStream<Location, Error>.Continuation?
    
    // Exposed stream
    var locations: AsyncThrowingStream<Location, Error> {
        AsyncThrowingStream { continuation in
            self.locationContinuation = continuation
        }
    }

    var headings: AsyncThrowingStream<Double, Error> {
        AsyncThrowingStream { continuation in
            Task {
                while !Task.isCancelled {
                    continuation.yield(.random(in: 0...360))
                    await Task.yield()
                }
                continuation.finish()
            }
        }
    }

    // Push location from outside
    public func setNewLocation(_ position: UserPosition) {
        let loc = Location(
            position: position.latLng.toAGSPoint(),
            horizontalAccuracy: position.accuracy ?? 0,
            verticalAccuracy: position.accuracy ?? 0,
            speed: position.velocity ?? 0,
            course: position.heading ?? 0,
            isLastKnown: false
        )
        locationContinuation?.yield(loc)
    }
}

