//
//  Created by Julian Bissekkou on 27.11.23.
//

import Foundation
import ArcGIS

final class CustomLocationProvider: LocationProvider {
    private var locationContinuation: AsyncStream<Location>.Continuation?
    private var headingContinuation: AsyncStream<Double>.Continuation?
    
    
    // Exposed stream
    var locations: AsyncStream<Location> {
        AsyncStream { @Sendable continuation in
            self.locationContinuation = continuation
            continuation.onTermination = { _ in
                self.locationContinuation = nil
            }
        }
    }
    
    var headings: AsyncStream<Double> {
        AsyncStream { continuation in
            self.headingContinuation = continuation
            continuation.onTermination = { @Sendable _ in
                self.headingContinuation = nil
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
        if let heading = position.heading {
            headingContinuation?.yield(heading)
        }
    }
}

