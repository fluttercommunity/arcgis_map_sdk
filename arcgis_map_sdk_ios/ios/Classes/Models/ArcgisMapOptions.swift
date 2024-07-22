//
//  ArcgisMapOptions.swift
//  arcgis_map_sdk_ios
//
//  Created by Julian Bissekkou on 10.10.22.
//

import Foundation

struct ArcgisMapOptions: Codable {
    let apiKey: String?
    let licenseKey: String?
    let basemap: String?
    let vectorTilesUrls: Array<String>?
    let initialCenter: LatLng;
    let zoom: Double
    let padding: ViewPadding
    let isInteractive: Bool
    let rotationEnabled: Bool
    let minZoom: Int
    let maxZoom: Int
    let xMin: Int
    let xMax: Int
    let yMin: Int
    let yMax: Int
    let isAttributionTextVisible: Bool?
}
