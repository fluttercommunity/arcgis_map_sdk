// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "arcgis_map_sdk_ios",
    platforms: [
        .iOS("16.0")
    ],
    products: [
        .library(name: "arcgis-map-sdk-ios", targets: ["arcgis_map_sdk_ios"])
    ],
    dependencies: [
        .package(url: "https://github.com/Esri/arcgis-maps-sdk-swift",  .upToNextMinor(from: "200.7.0")),
    ],
    targets: [
        .target(
            name: "arcgis_map_sdk_ios",
            dependencies: [
                .product(name: "ArcGIS", package: "arcgis-maps-sdk-swift")
            ]
        ),
    ]
)
