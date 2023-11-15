# Arcgis example app

An example app for the plugin. Works on web, android and iOs.

## Add the package to your app

In your app's pubspec.yaml dependencies, add e.g. for web:

```
  arcgis_map:
    git:
      url: git@github.com:fluttercommunity/arcgis_map.git
      path: arcgis_map
      ref: main
  arcgis_map_web:
    git:
      url: git@github.com:fluttercommunity/arcgis_map.git
      path: arcgis_map_web
      ref: main
```

Import the package in your dart file

```
import 'package:arcgis_map/arcgis_map.dart';
```

Finally, use the `ArcgisMap` Widget in similar way as the example.