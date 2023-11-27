//
//  UserPosition.swift
//  arcgis_map_sdk_ios
//
//  Created by Julian Bissekkou on 27.11.23.
//

import Foundation

struct UserPosition: Codable {
    let latLng: LatLng
    let accuracy: Double?
    let heading: Double?
}
