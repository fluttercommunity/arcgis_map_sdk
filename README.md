# Arcgis flutter package

A package for using arcgis maps with Flutter web.

## Add the package to your app

In your app's pubspec.yaml dependencies, add:
```
  arcgis_map:
    git:
      url: git@github.com:vfdigitalincubator/arcgis_flutter.git
      path: arcgis_map
      ref: v0.6.19
  arcgis_map_platform_interface:
    git:
      url: git@github.com:vfdigitalincubator/arcgis_flutter.git
      path: arcgis_map_platform_interface
      ref: v0.6.19
  arcgis_map_web:
    git:
      url: git@github.com:vfdigitalincubator/arcgis_flutter.git
      path: arcgis_map_web
      ref: v0.6.19
```

Import the package in your dart file
```
import 'package:arcgis_map/arcgis_map.dart';
import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
```

Finally, use the `ArcgisMap` Widget in similar way as the example.