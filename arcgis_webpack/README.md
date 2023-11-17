## ArcGis js packed with webpack

Allows lazy loading

## Build using Sidekick

The preferred way to build/generate the **_arcgis_webpack_** asset files is to use Sidekick. The new generated files
will be automatically copied to the **_arcgis_map_sdk_web_** package and . Run `./am gen:arcgis-webpack` to generate the
files.

For more information run `./am --help`.

## Build manually using webpack

```
npm install
npm run build
```

### Generated output files

Output files will be generated directly into `../arcgis_map_sdk_web/assets/arcgis_js_api_custom_build` folder.