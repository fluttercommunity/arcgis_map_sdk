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
    let autoPanMode: AutoPanMode
}

// Use this helper class because AGSLocationDisplayAutoPanMode is not Codable
enum AutoPanMode: Codable {
    case off
    case compassNavigation
    case navigation
    case recenter
    
    // Custom CodingKeys for encoding/decoding
    private enum CodingKeys: String, CodingKey {
        case type
    }
    
    // Encode the enum value
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .off:
            try container.encode("off", forKey: .type)
        case .compassNavigation:
            try container.encode("compassNavigation", forKey: .type)
        case .navigation:
                try container.encode("navigation", forKey: .type)
        case .recenter:
            try container.encode("recenter", forKey: .type)
        }
    }
    
    // Decode the enum value
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let type = try container.decode(String.self, forKey: .type)
        
        switch type {
        case "off":
            self = .off
        case "compassNavigation":
            self = .compassNavigation
        case "navigation":
            self = .navigation
        case "recenter":
            self = .recenter
        default:
            throw DecodingError.dataCorruptedError(forKey: .type, in: container, debugDescription: "Invalid auto pan mode")
        }
    }
}
