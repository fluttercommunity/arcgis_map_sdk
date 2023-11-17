# arcgis_map for Flutter

[![Flutter Community: arcgis_map](https://fluttercommunity.dev/_github/header/arcgis_map)](https://github.com/fluttercommunity/community)


<img src="https://github.com/fluttercommunity/arcgis_map/assets/1096485/14bd3d39-0770-4fd0-9d94-c6bce679fcd4" alt="Arcgis on iPad" width="600" />

## Setup


### Add the package to your app

In your app's pubspec.yaml dependencies, add:

```yaml
dependencies:
  arcgis_map: ^0.7.5
```


### Android only setup
(Android) In `<app>/android/app/proguard-rules.pro` add:

```
-keep class esri.arcgis.flutter_plugin.** { *; }
```


### Use ArcgisMap
Integrate the `ArcgisMap` Widget

```dart 
import 'package:arcgis_map/arcgis_map.dart';
import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ArcgisMap(
        apiKey: arcGisApiKey,
        initialCenter: const LatLng(51.16, 10.45),
        zoom: 8,
        mapStyle: MapStyle.twoD,
        basemap: BaseMap.arcgisChartedTerritory,
        onMapCreated: (controller) async {
          
          const pinLayerId = 'pins';
          await controller.addGraphic(
            layerId: pinLayerId,
            graphic: PointGraphic(
              latitude: 51.091062,
              longitude: 6.880812,
              attributes: Attributes({
                'id': 'phntm',
                'name': 'PHNTM GmbH',
                'family': 'Office',
              }),
              symbol: const PictureMarkerSymbol(
                webUri:
                "https://github.com/fluttercommunity/arcgis_map/assets/1096485/94178dba-5bb8-4f1e-a160-31bfe4c93d17",
                mobileUri:
                "https://github.com/fluttercommunity/arcgis_map/assets/1096485/94178dba-5bb8-4f1e-a160-31bfe4c93d17",
                width: 314 / 2,
                height: 120 / 2,
              ),
            ),
          );

          await controller.addGraphic(
            layerId: pinLayerId,
            graphic: PointGraphic(
              latitude: 48.1234963,
              longitude: 11.5910182,
              attributes: Attributes({
                'id': 'tapped',
                'name': 'Tapped UG',
                'family': 'Office',
              }),
              symbol: const PictureMarkerSymbol(
                webUri:
                "https://github.com/fluttercommunity/arcgis_map/assets/1096485/c84c524c-78b7-46e5-9bf1-a3a91853b2cf",
                mobileUri:
                "https://github.com/fluttercommunity/arcgis_map/assets/1096485/c84c524c-78b7-46e5-9bf1-a3a91853b2cf",
                width: 312 / 2,
                height: 111 / 2,
              ),
            ),
          );
        },
      ),
    );
  }
```

Checkout the example app `example/lib/main.dart` for more details.



## Platform support

| Feature              | web | ios | android |
|----------------------|:---:|:---:|:-------:|
| 3D Map               |  ✅  |     |         |
| Vector tiles         |  ✅  |  ✅  |    ✅    |
| centerPosition       |  ✅  |  ✅  |    ✅    |
| rotation             |  ✅  |  ✅  |    ✅    |
| setInteraction       |  ✅  |  ✅  |    ✅    |
| addViewPadding       |  ✅  |  ✅  |    ✅    |
| toggleBaseMap        |  ✅  |  ✅  |    ✅    |
| moveCamera           |  ✅  |  ✅  |    ✅    |
| zoomIn               |  ✅  |  ✅  |    ✅    |
| zoomOut              |  ✅  |  ✅  |    ✅    |
| getZoom              |  ✅  |  ✅  |    ✅    |
| addGraphic           |  ✅  |  ✅  |    ✅    |
| removeGraphic        |  ✅  |  ✅  |    ✅    |
| updateGraphicSymbol  |  ✅  |     |         |
| getGraphicsInView    |  ✅  |     |         |
| getVisibleGraphicIds |  ✅  |     |         |
| FeatureLayer         |  ✅  |     |         |
| updateFeatureLayer   |  ✅  |     |         |
| destroyLayer         |  ✅  |     |         |
| mouse cursor         |  ✅  |     |         |
| visibleGraphics      |  ✅  |     |         |
| getBounds            |  ✅  |     |         |
| attributionText      |  ✅  |     |         |
| onClickListener      |  ✅  |     |         |
| polygonContainsPoint |  ✅  |     |         |

## Development

1. Clone the repository.
2. `cd` into the project directory.
3. Run `./am deps` and ensure it completes without errors.

The project has its own collection of scripts wrapped into one convenient command called `am`.
Run `./am -h` to explore what the command can do.
This uses the cli tool https://github.com/phntmxyz/sidekick.

