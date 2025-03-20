// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "arcgis_map_sdk_ios",
    platforms: [
        .iOS("14.0")
    ],
    products: [
        .library(name: "arcgis-map-sdk-ios", targets: ["arcgis_map_sdk_ios"])
    ],
    dependencies: [
        .package(url: "https://github.com/Esri/arcgis-runtime-ios", .upToNextMinor(from: "100.15.0")),
    ],
    targets: [
        .target(
            name: "arcgis_map_sdk_ios",
            dependencies: [
                .product(name: "ArcGIS", package: "arcgis-runtime-ios")
            ]
        ),
    ]
)
