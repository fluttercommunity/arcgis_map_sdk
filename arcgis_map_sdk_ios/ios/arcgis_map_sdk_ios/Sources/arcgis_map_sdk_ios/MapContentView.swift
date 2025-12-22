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
                // Wichtig: kein Stop hier.
                // Der PlatformView wird bei euch durch State-Update entfernt und wir machen
                // das Stoppen deterministisch über den expliziten Dart->Swift "dispose" Call.
                // Dadurch vermeiden wir konkurrierende stop() Aufrufe während Rendering.

                // Clear the mapViewProxy reference when view disappears
                viewModel.mapViewProxy = nil
            }
            .ignoresSafeArea(edges: .all)
            .task {
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

    private var stopTask: Task<Void, Never>?
    private var didRequestStop = false

    init(viewpoint : Viewpoint) {
        self.viewpoint = viewpoint
    }

    /// Stops the location data source.
    ///
    /// This must be serialized to avoid concurrent `stop()` calls triggering ArcGIS internal races.
    @MainActor
    func stopLocationDataSource() {
        if didRequestStop {
            return
        }
        didRequestStop = true

        // 1) Synchronously disable auto-pan to immediately stop map updates
        locationDisplay.autoPanMode = .off

        // 2) Asynchronously stop the data source (single flight)
        stopTask?.cancel()
        stopTask = Task { [locationDisplay] in
            await locationDisplay.dataSource.stop()
        }
    }
}
