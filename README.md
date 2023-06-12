# Arcgis flutter package

A package for using arcgis maps with Flutter web.


## Setup

1. Clone the repository.
2. `cd` into the project directory.
3. Run `./am init` and ensure it completes without errors.

The project has its own collection of scripts wrapped into one convenient command called `am`.
Run `./am -h` to explore what the command can do.
This uses the cli tool https://github.com/phntmxyz/sidekick.

## Add the package to your app

In your app's pubspec.yaml dependencies, add:

```
  arcgis_map:
    git:
      url: git@github.com:phntmxyz/arcgis_map.git
      path: arcgis_map
      ref: main
  arcgis_map_platform_interface:
    git:
      url: git@github.com:phntmxyz/arcgis_map.git
      path: arcgis_map_platform_interface
      ref: main
  arcgis_map_web:
    git:
      url: git@github.com:phntmxyz/arcgis_map.git
      path: arcgis_map_web
      ref: main
```

(Android) In `<app>/android/app/proguard-rules.pro` add:

```
-keep class esri.arcgis.flutter_plugin.** { *; }
```

Import the package in your dart file

```
import 'package:arcgis_map/arcgis_map.dart';
import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';
```

Finally, use the `ArcgisMap` Widget in similar way as the example.
