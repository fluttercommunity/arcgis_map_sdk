# Arcgis example app

An example app for the plugin. Works only on web, as does the plugin.

## Run the example app

To run the example app type
`flutter run --web-renderer=canvaskit --profile --dart-define=DEV_DRAWER=true`
in the terminal.

## Add the package to your app

In your app's pubspec.yaml dependencies, add:
```
  arcgis_map:
    git:
      url: git@github.com:vfdigitalincubator/arcgis_flutter.git
      path: packages/arcgis_map
      ref: v0.5.1
  arcgis_map_web:
    git:
      url: git@github.com:vfdigitalincubator/arcgis_flutter.git
      path: packages/arcgis_map_web
      ref: v0.5.1
```

Import the package in your dart file
```
import 'package:arcgis_map/arcgis_map.dart';
import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
```

Finally, use the `ArcgisMap` Widget in similar way as the example.