//
//  Created by Tarek Tolba on 29/04/2025.
//

import SwiftUI
import ArcGIS
import CoreLocation


struct MapContentView: View {
    @ObservedObject var viewModel: MapViewModel
    
    init(viewModel: MapViewModel) {
        self.viewModel = viewModel
    }
    
    var body: some View {
        MapViewReader { mapViewProxy in
            MapView(
                map: viewModel.map,
                viewpoint: viewModel.viewpoint,
                graphicsOverlays: [viewModel.defaultGraphicsOverlay]
            )
            .attributionBarHidden(viewModel.attributionBarHidden)
            .locationDisplay(viewModel.locationDisplay)
            .contentInsets(viewModel.contentInsets)
            .interactionModes(viewModel.interactionModes)
            .onViewpointChanged(kind: .centerAndScale) { newViewpoint in
                viewModel.viewpoint = newViewpoint
            }
            .onScaleChanged { scale in
                viewModel.onScaleChanged?(scale)
            }
            .onVisibleAreaChanged { polygon in
                viewModel.onVisibleAreaChanged?(polygon)
            }
            .task {
                // Store the mapViewProxy for external access
                viewModel.mapViewProxy = mapViewProxy
                viewModel.onViewInit?();
            }
            .onDisappear {
                viewModel.stopLocationDataSource()
                // Clear the mapViewProxy reference when view disappears
                viewModel.mapViewProxy = nil
            }
            .ignoresSafeArea(edges: .all)
            .task {
                // Listen for load status changes and set the load status text.
                for await loadStatus in viewModel.map.$loadStatus {
                    viewModel.onLoadStatusChanged?(loadStatus)
                }
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
    
    var onScaleChanged: ((Double) -> Void)?
    var onVisibleAreaChanged: ((Polygon) -> Void)?
    var onLoadStatusChanged: ((LoadStatus) -> Void)?
    var onViewInit: (() -> Void)?
    
    init(viewpoint : Viewpoint) {
        self.viewpoint = viewpoint
    }
    
    /// Stops the location data source.
    func stopLocationDataSource() {
        Task {
            await locationDisplay.dataSource.stop()
        }
    }
}
