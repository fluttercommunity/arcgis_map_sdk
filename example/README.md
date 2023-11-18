# Arcgis example app

An example app for the plugin. Works on web, android and iOS.

## Add the package to your app

In your app's pubspec.yaml dependencies, add e.g. for web:

```yaml
dependencies:
  arcgis_map_sdk:
```

Import the package in your dart file

```
import 'package:arcgis_map_sdk/arcgis_map_sdk.dart';
```

Finally, use the `ArcgisMap` Widget in similar way as the example.