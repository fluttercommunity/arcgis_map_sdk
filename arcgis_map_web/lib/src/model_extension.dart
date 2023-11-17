import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';

extension AnimationOptionsJsonExtension on AnimationOptions {
  Map<String, dynamic> toMap() {
    return {'duration': duration, 'animationCurve': animationCurve.name};
  }
}

extension ViewPaddingJsonExtension on ViewPadding {
  Map<String, dynamic> toMap() {
    return {'left': left, 'top': top, 'right': right, 'bottom': bottom};
  }
}

extension LatLngJsonExtension on LatLng {
  Map<String, double> toMap() => {
        "longitude": longitude,
        "latitude": latitude,
      };
}

// region Graphics

extension GraphicToJsonExtension on Graphic {
  Map<String, dynamic> toJson() => when(
        ifPointGraphic: (graphic) => graphic.convertToJson(),
        ifPolygonGraphic: (graphic) => graphic.convertToJson(),
        ifPolylineGraphic: (graphic) => graphic.convertToJson(),
      );
}

extension on PointGraphic {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'geometry': <String, dynamic>{
          'type': 'point',
          'longitude': longitude,
          'latitude': latitude,
          'z': height,
        },
        'attributes': attributes.data,
        'symbol': symbol.toJson(),
      };
}

extension on PolygonGraphic {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'geometry': <String, dynamic>{
          'type': 'polygon',
          'rings': rings,
        },
        'symbol': symbol.toJson(),
        'attributes': attributes.data,
      };
}

extension on PolylineGraphic {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'geometry': <String, dynamic>{
          'type': 'polyline',
          'paths': paths,
        },
        'symbol': symbol.toJson(),
        'attributes': attributes.data,
      };
}

// endregion

extension FieldJsonExtension on Field {
  Map<String, dynamic> toJson() => {
        'name': name,
        'alias': name,
        'type': type,
      };
}

/*
*   /// Each list of LatLongs creates a polyline
  ///
  /// An array of paths, or line segments, that make up the polyline.
  /// Each path is a two-dimensional array of numbers representing the coordinates of each vertex in the
  /// path in the spatial reference of the view. Each vertex is represented as an array of two, three, or four numbers.
  ///
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html#paths*/
// TODO for the PolylineGraphic

// region symbols

extension SymbolToJsonExtension on Symbol {
  Map<String, dynamic> toJson() => when(
        ifSimpleFillSymbol: (s) => s.convertToJson(),
        ifSimpleMarkerSymbol: (s) => s.convertToJson(),
        ifPictureMarkerSymbol: (s) => s.convertToJson(),
        ifSimpleLineSymbol: (s) => s.convertToJson(),
        ifMeshSymbol3D: (s) => s.convertToJson(),
      );
}

extension on MeshSymbol3D {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'mesh-3d',
        'symbolLayers': [
          {
            'type': 'fill',
            'material': {
              'color': [color.red, color.green, color.blue, colorOpacity],
            },
          },
        ],
      };
}

extension on SimpleMarkerSymbol {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'simple-marker',
        'color': [color.red, color.green, color.blue, colorOpacity],
        'size': radius,
        'outline': <String, dynamic>{
          'color': [
            outlineColor.red,
            outlineColor.green,
            outlineColor.blue,
            outlineColorOpacity,
          ],
          'width': outlineWidth,
        },
      };
}

extension on PictureMarkerSymbol {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'picture-marker',
        'url': webUri,
        'width': '${width}px',
        'height': '${height}px',
        'xoffset': '${xOffset}px',
        'yoffset': '${yOffset}px',
      };
}

extension on SimpleFillSymbol {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'simple-fill',
        'color': [fillColor.red, fillColor.green, fillColor.blue, opacity],
        'outline': {
          'color': [
            outlineColor.red,
            outlineColor.green,
            outlineColor.blue,
          ], // White
          'width': outlineWidth,
        },
      };
}

extension on SimpleLineSymbol {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'cap': cap.value,
        'color': [color?.red, color?.green, color?.blue, colorOpacity],
        'declaredClass': declaredClass,
        'join': join.value,
        'marker': marker?.convertToJson(),
        'miterLimit': miterLimit,
        'style': style.value,
        'type': 'simple-line', // autocasts as new SimpleLineSymbol()
        'width': width,
      };
}

extension on LineSymbolMarker {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'color': [color?.red, color?.green, color?.blue, colorOpacity],
        'declaredClass': declaredClass,
        'placement': placement.value,
        'style': style.value,
        'type': 'line-marker',
      };
}

extension BaseMapExt on BaseMap {
  static const Map<BaseMap, String> values = {
    BaseMap.arcgisImagery: 'arcgis-imagery',
    BaseMap.arcgisImageryStandard: 'arcgis-imagery-standard',
    BaseMap.arcgisImageryLabels: 'arcgis-imagery-labels',
    BaseMap.arcgisLightGray: 'arcgis-light-gray',
    BaseMap.arcgisDarkGray: 'arcgis-dark-gray',
    BaseMap.arcgisNavigation: 'arcgis-navigation',
    BaseMap.arcgisNavigationNight: 'arcgis-navigation-night',
    BaseMap.arcgisStreets: 'arcgis-streets',
    BaseMap.arcgisStreetsNight: 'arcgis-streets-night',
    BaseMap.arcgisStreetsRelief: 'arcgis-streets-relief',
    BaseMap.arcgisTopographic: 'arcgis-topographic',
    BaseMap.arcgisOceans: 'arcgis-oceans',
    BaseMap.osmStandard: 'osm-standard',
    BaseMap.osmStandardRelief: 'osm-standard-relief',
    BaseMap.osmStreets: 'osm-streets',
    BaseMap.osmStreetsRelief: 'osm-streets-relief',
    BaseMap.osmLightGray: 'osm-light-gray',
    BaseMap.osmDarkGray: 'osm-dark-gray',
    BaseMap.arcgisTerrain: 'arcgis-terrain',
    BaseMap.arcgisCommunity: 'arcgis-community',
    BaseMap.arcgisChartedTerritory: 'arcgis-charted-territory',
    BaseMap.arcgisColoredPencil: 'arcgis-colored-pencil',
    BaseMap.arcgisNova: 'arcgis-nova',
    BaseMap.arcgisModernAntique: 'arcgis-modern-antique',
    BaseMap.arcgisMidcentury: 'arcgis-midcentury',
    BaseMap.arcgisNewspaper: 'arcgis-newspaper',
    BaseMap.arcgisHillshadeLight: 'arcgis-hillshade-light',
    BaseMap.arcgisHillshadeDark: 'arcgis-hillshade-dark',
    BaseMap.nationalGepgraphic: 'national-geographic',
    BaseMap.streetsNavigationVector: 'streets-navigation-vector',
    BaseMap.darkGrayVector: 'dark-gray-vector',
    BaseMap.grayVector: 'gray-vector',
    BaseMap.topo: 'topo',
    BaseMap.gray: 'gray',
    BaseMap.darkGray: 'dark-gray',
    BaseMap.terrain: 'terrain',
    BaseMap.hybrid: 'hybrid',
    BaseMap.streets: 'streets',
    BaseMap.oceans: 'oceans',
    BaseMap.osm: 'osm',
    BaseMap.satellite: 'satellite',
    BaseMap.topoVector: 'topo-vector',
    BaseMap.streetsNightVector: 'streets-night-vector',
    BaseMap.streetsVector: 'streets-vector',
    BaseMap.streetsReliefVector: 'streets-relief-vector',
  };

  String get value => values[this]!;
}

extension GroundExt on Ground {
  static const Map<Ground, String> values = {
    Ground.worldElevation: 'world-elevation',
    Ground.worldTopobathymetry: 'world-topobathymetry',
  };

  String get value => values[this]!;
}

// endregion
