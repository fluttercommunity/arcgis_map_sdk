//
//  Created by Tarek Tolba on 29/04/2025.
//

import SwiftUI
import ArcGIS
import CoreLocation


struct MapContentView: View {
    @ObservedObject var mapViewModel: MapViewModel
        
    init(mapViewModel: MapViewModel) {
        self.mapViewModel = mapViewModel
    }
    
    var body: some View {
        MapViewReader { mapViewProxy in
            MapView(map: mapViewModel.map,
                    viewpoint: mapViewModel.viewpoint,
                    graphicsOverlays: [mapViewModel.defaultGraphicsOverlay])
                .attributionBarHidden(mapViewModel.attributionBarHidden)
                .locationDisplay(mapViewModel.locationDisplay)
                .contentInsets(mapViewModel.contentInsets)
                .interactionModes(mapViewModel.interactionModes)
                .onViewpointChanged(kind: .centerAndScale) { newViewpoint in
                    mapViewModel.viewpoint = newViewpoint
                }.onScaleChanged(perform: { scale in
                    mapViewModel.onScaleChanged?(scale)
                }).onVisibleAreaChanged(perform: { polygon in
                    mapViewModel.onVisibleAreaChanged?(polygon)
                })
                .onChange(of: mapViewModel.map.basemap?.loadStatus) { newValue in
                    if let newValue {
                         mapViewModel.onLoadStatusChanged?(newValue)
                     }
                }
                .task {
                    // Store the mapViewProxy for external access
                    mapViewModel.mapViewProxy = mapViewProxy
                    
//                    await mapViewModel.locationDidChange()
                }
                .onDisappear {
                    mapViewModel.stopLocationDataSource()
                    // Clear the mapViewProxy reference when view disappears
                    mapViewModel.mapViewProxy = nil
                }
        }
    }
}


class MapViewModel: ObservableObject {
    let map = Map()
    let locationDisplay = LocationDisplay()
    
    @Published var viewpoint: Viewpoint
    @Published var mapViewProxy: MapViewProxy?
    @Published var attributionBarHidden: Bool = false
    @Published var contentInsets: EdgeInsets = EdgeInsets()
    @Published var interactionModes: MapViewInteractionModes = .all
    @Published var defaultGraphicsOverlay = GraphicsOverlay()
    /// The latest location update from the location data source.
    @Published var currentLocation: Location?
    
    var onScaleChanged: ((Double) -> Void)?
    var onVisibleAreaChanged: ((Polygon) -> Void)?
    var onLoadStatusChanged: ((LoadStatus) -> Void)?
    
    init(viewpoint : Viewpoint) {
        self.viewpoint = viewpoint
    }
    
    // Methods that can be called from outside
    func setViewpoint(_ newViewpoint: Viewpoint) {
        viewpoint = newViewpoint
    }
    
    func setViewpointGeometry(_ geometry: Geometry) async {
        guard let mapViewProxy = mapViewProxy else { return }
        await mapViewProxy.setViewpointGeometry(geometry)
    }

    /// Stops the location data source.
    func stopLocationDataSource() {
        Task {
            await locationDisplay.dataSource.stop()
        }
    }
    
//    /// Uses `for-await-in` to access location updates produced by the async stream.
//    @MainActor
//    func locationDidChange() async {
//        for await newLocation in locationDisplay.dataSource.locations {
//            currentLocation = newLocation
//        }
//    }
}
