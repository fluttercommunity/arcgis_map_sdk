import 'package:arcgis_map_sdk_platform_interface/arcgis_map_sdk_platform_interface.dart';
import 'package:flutter/widgets.dart';

extension AnimationOptionsJsonExtension on AnimationOptions {
  Map<String, Object?> toMap() {
    return {'duration': duration, 'animationCurve': animationCurve.name};
  }
}

extension ViewPaddingJsonExtension on ViewPadding {
  Map<String, Object?> toMap() {
    return {'left': left, 'top': top, 'right': right, 'bottom': bottom};
  }
}

extension LatLngJsonExtension on LatLng {
  Map<String, double> toMap() => {
        "longitude": longitude,
        "latitude": latitude,
      };
}

extension UserPositionExtension on UserPosition {
  Map<String, Object?> toMap() => {
        'latLng': latLng.toMap(),
        'accuracy': accuracy,
        'heading': heading,
        'velocity': velocity,
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
        'type': 'point',
        'attributes': attributes.data,
        'point': LatLng(latitude, longitude).toMap(),
        'symbol': symbol.toJson(),
      };
}

extension on PolygonGraphic {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'polygon',
        'rings': rings,
        'symbol': symbol.toJson(),
        'attributes': attributes.data,
      };
}

extension on PolylineGraphic {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'polyline',
        'paths': paths,
        'symbol': symbol.toJson(),
        'attributes': attributes.data,
      };
}

// endregion

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
        'color': _colorToJson(color),
        'size': radius,
        'outlineColor': _colorToJson(outlineColor),
        'outlineWidth': outlineWidth,
      };
}

extension on PictureMarkerSymbol {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'picture-marker',
        'url': mobileUri,
        'width': width,
        'height': height,
        'xOffset': xOffset,
        'yOffset': yOffset,
      };
}

extension on SimpleFillSymbol {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'simple-fill',
        'fillColor': _colorToJson(fillColor),
        'outlineColor': _colorToJson(outlineColor),
        'outlineWidth': outlineWidth,
      };
}

extension on SimpleLineSymbol {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'type': 'simple-line',
        'cap': cap.name,
        'color': _colorToJson(color),
        'declaredClass': declaredClass,
        'join': join.name,
        'marker': marker?.convertToJson(),
        'miterLimit': miterLimit,
        'style': style.name,
        'width': width,
      };
}

extension on LineSymbolMarker {
  Map<String, dynamic> convertToJson() => <String, dynamic>{
        'color': _colorToJson(color),
        'declaredClass': declaredClass,
        'placement': placement.name,
        'style': style.name,
      };
}

Map<String, Object?>? _colorToJson(Color? color) {
  if (color == null) return null;

  return {
    'red': color.red,
    'green': color.green,
    'blue': color.blue,
    'opacity': color.opacity,
  };
}

// endregion
