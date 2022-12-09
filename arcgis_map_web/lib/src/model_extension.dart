import 'package:arcgis_map_platform_interface/arcgis_map_platform_interface.dart';

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

extension ArcgisMapOptionsJsonExtension on ArcgisMapOptions {
  Map<String, dynamic> toMap() {
    return <String, Object?>{
      'apiKey': apiKey,
      'basemap': basemap?.name,
      "vectorTilesUrls": vectorTilesUrls,
      'initialCenter': initialCenter.toMap(),
      'isInteractive': isInteractive,
      'zoom': zoom,
      'hideDefaultZoomButtons': hideDefaultZoomButtons,
      'hideAttribution': hideAttribution,
      'padding': padding.toMap(),
      'rotationEnabled': rotationEnabled,
      'minZoom': minZoom,
      'maxZoom': maxZoom,
      'xMin': xMin,
      'xMax': xMax,
      'yMin': yMin,
      'yMax': yMax,
    };
  }
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
        },
        'attributes': attributes.toMap(),
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
        'attributes': attributes.toMap(),
      };
}

extension on PolylineGraphic {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'geometry': <String, dynamic>{
          'type': 'polyline',
          'paths': paths,
        },
        'symbol': symbol.toJson(),
        'attributes': attributes.toMap(),
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

extension ArcGisMapAttributesJsonExtension on ArcGisMapAttributes {
  Map<String, Object> toMap() {
    return {
      'id': id,
      'name': name,
    };
  }

//TODO define static
/*ArcGisMapAttributes.fromMap(Map<String, Object> map)
      : id = map['id'].toString(),
        name = map['name'].toString();*/
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

extension on Symbol {
  Map<String, dynamic> toJson() => when(
        ifSimpleFillSymbol: (s) => s.convertToJson(),
        ifSimpleMarkerSymbol: (s) => s.convertToJson(),
        ifPictureMarkerSymbol: (s) => s.convertToJson(),
        ifSimpleLineSymbol: (s) => s.convertToJson(),
      );
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
            outlineColorOpacity
          ],
          'width': outlineWidth,
        },
      };
}

extension on PictureMarkerSymbol {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'picture-marker',
        'url': uri,
        'width': '${width}px',
        'height': '${height}px',
        'xoffset': '${xOffset}px',
        'yoffset': '${yOffset}px'
      };
}

extension on SimpleFillSymbol {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'simple-fill',
        'color': [fillColor.red, fillColor.green, fillColor.blue, opacity],
        'outline': {
          'color': [outlineColor.red, outlineColor.green, outlineColor.blue],
          'width': outlineWidth
        }
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
        'type': 'simple-line',
        // autocasts as new SimpleLineSymbol()
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

// endregion
