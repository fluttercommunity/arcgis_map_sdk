//
//  ArcgisMapOptions.swift
//  arcgis_map
//
//  Created by Julian Bissekkou on 10.10.22.
//

import Foundation

struct ArcgisMapOptions: Codable {
    let apiKey: String
    let basemap: String
    let initialCenter: LatLng;
    let zoom: Double
    let hideDefaultZoomButtons: Bool
    let hideAttribution: Bool
    let padding: ViewPadding
    let rotationEnabled: Bool
    let minZoom: Int
    let maxZoom: Int
    let xMin: Int
    let xMax: Int
    let yMin: Int
    let yMax: Int
}