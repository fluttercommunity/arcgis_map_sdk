@JS()
library arcgis_map_web;

import 'dart:async';
import 'dart:js_util';

import 'package:js/js.dart';

export 'package:arcgis_map_web/src/arcgis_map_web.dart';

@JS("JSON.stringify")
external dynamic jsonStringify(dynamic value);

@JS("esri.core.geometry.Point")
class JsPoint {
  external double get latitude;

  external double get longitude;

  external factory JsPoint(dynamic map);
}

@JS("loadFeatureLayer")
external Object loadFeatureLayer();

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-Layer.html
@JS("esri.core.layers.Layer")
class JsLayer extends Accessor {
  external String id;

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-Layer.html#type
  /// Possible Values:
  /// "base-dynamic"|"base-elevation"|"base-tile"|"bing-maps"|"building-scene"|"csv"|"dimension"|"elevation"|"feature"|
  /// "geojson"|"geo-rss"|"graphics"|"group"|"imagery"|"imagery-tile"|"integrated-mesh"|"kml"|"line-of-sight"|"map-image"
  /// |"map-notes"|"media"|"ogc-feature"|"open-street-map"|"point-cloud"|"route"|"scene"|"georeferenced-image"|"stream"
  /// |"tile"|"unknown"|"unsupported"|"vector-tile"|"wcs"|"web-tile"|"wfs"|"wms"|"wmts"|"voxel"|"subtype-group"
  external String get type;

  external void destroy();

  external String url;
}

@JS("FeatureLayer")
class JsFeatureLayer {
  external factory JsFeatureLayer(dynamic map);

  external Promise<JsFeatureSet> queryFeatures();

  external Promise<JsEditsResult> applyEdits(dynamic data);

  external String get id;
}

@JS("esri.core.layers.GraphicsLayer")
class JsGraphicsLayer extends Accessor {
  external factory JsGraphicsLayer(dynamic map);

  external void add(JsGraphic graphic);

  external void addMany(Collection<JsGraphic> graphic);

  external void remove(JsGraphic graphic);

  external void removeAll();

  external void destroy();

  external set elevationInfo(dynamic data);

  external dynamic get elevationInfo;

  external Collection<JsGraphic>? get graphics;

  external String get id;
}

/// https://developers.arcgis.com/javascript/latest/sample-code/layers-scenelayer/
@JS("esri.core.layers.SceneLayer")
class JsSceneLayer extends Accessor {
  external factory JsSceneLayer(dynamic map);

  external set elevationInfo(dynamic data);

  external dynamic get elevationInfo;

  external String get id;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-ui-DefaultUI.html
@JS("esri.views.ui.DefaultUI")
abstract class DefaultUI {
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-ui-DefaultUI.html#components
  external List<String> components;

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-ui-DefaultUI.html#add
  void add(dynamic widget, [String? optionName]);

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-ui-DefaultUI.html#remove
  void remove(dynamic widget);
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Attribution.html
@JS("esri.core.widgets.Attribution")
class JsAttribution extends Accessor {
  external factory JsAttribution(dynamic map);

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Attribution.html#visible
  external bool get visible;
}

@JS("esri.core.Map")
class JsEsriMap {
  external factory JsEsriMap(dynamic map);

  external void add(dynamic layer);

  external dynamic findLayerById(String layerId);

  external Collection<JsLayer>? get layers;

  external JsBaseMap get basemap;

  external JsLayer reorder(dynamic layer, int index);

  external String? ground;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-VectorTileLayer.html
@JS("esri.core.layers.VectorTileLayer")
class JsVectorTileLayer extends JsLayer {
  external factory JsVectorTileLayer(dynamic map);
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-Basemap.html
@JS("esri.core.Basemap")
class JsBaseMap extends Accessor {
  external factory JsBaseMap(dynamic basemap);

  external Collection referenceLayers;
}

@JS("esri.core.Collection")
class Collection<T> {
  external int get length;

  external T? find(Function callback);

  external Collection<T>? filter(Function callback);

  external int findIndex(Function callback);

  external void forEach(Function collection);

  external void removeAt(int index);

  external void removeMany(Collection<T>? items);

  external void removeAll();

  external void add(dynamic graphics, [int? index]);
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html
@JS("esri.Graphic")
abstract class JsGraphic extends Accessor {
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html#geometry
  external JsGeometry get geometry;

  external JsAttributes attributes;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Geometry.html
@JS("esri.geometry.Geometry")
abstract class JsGeometry {
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Geometry.html#extent
  external JsExtent get extent;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html#attributes
@JS()
abstract class JsAttributes {
  external String get id;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html
@JS("esri.geometry.Extent")
abstract class JsExtent {
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html#contains
  external bool contains(dynamic geometry);

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html#intersects
  external bool intersects(dynamic geometry);

  external JsPoint get center;

  external double get height;

  external double get width;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-View.html
@JS("esri.core.views.View")
class JsView extends Accessor {
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-View.html#type
  external String get type;

  external double get zoom;

  external set padding(dynamic padding);

  external DefaultUI get ui;

  external dynamic get padding;

  external JsHandle on(List<String> event, void Function(dynamic) callback);

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#hitTest
  external Promise<JsHitTestResult> hitTest(dynamic event, [dynamic options]);

  external Promise<Object?> goTo(dynamic target, [dynamic targetOptions]);

  external Collection<JsGraphic> get graphics;

  external Object get center;

  external set popup(Popup? popup);

  external Popup? get popup;

  external dynamic container;
}

@JS("esri.core.views.MapView")
class JsMapView extends Accessor {
  external factory JsMapView(dynamic map);

  external double get zoom;

  external set padding(dynamic padding);

  external DefaultUI get ui;

  external dynamic get padding;

  external JsHandle on(List<String> event, void Function(dynamic) callback);

  external Promise<JsHitTestResult> hitTest(dynamic event);

  external Promise<Object?> goTo(dynamic target, [dynamic targetOptions]);

  external Collection<JsGraphic> get graphics;

  external String get id;

  external dynamic get components;

  external set components(dynamic components);

  external Object get center;

  external set popup(Popup? popup);

  external Popup? get popup;

  external JsViewpoint viewpoint;

  external dynamic container;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html
@JS("esri.core.views.SceneView")
class JsSceneView extends Accessor {
  external factory JsSceneView(dynamic map);

  external dynamic get padding;

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html#viewingMode
  /// Possible Values:"global"|"local"
  external String viewingMode;

  external DefaultUI get ui;

  external set padding(dynamic padding);

  external JsHandle on(List<String> event, void Function(dynamic) callback);

  external Promise<JsHitTestResult> hitTest(dynamic event);

  external Promise<Object?> goTo(dynamic target, [dynamic targetOptions]);

  external Collection<JsGraphic> get graphics;

  external String get id;

  external double get zoom;

  external set popup(Popup? popup);

  external Popup? get popup;

  external JsViewpoint viewpoint;

  external JsCamera camera;

  external dynamic container;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-Viewpoint.html
@JS("esri.core.Viewpoint")
class JsViewpoint {
  external factory JsViewpoint(dynamic map);

  external JsCamera camera;

  external double rotation;

  external double scale;

  external JsGeometry targetGeometry;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-Camera.html
@JS("esri.core.Camera")
class JsCamera {
  external factory JsCamera(dynamic map);

  external double heading;

  external double tilt;

  external JsPoint point;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-BasemapToggle.html
@JS("esri.core.widgets.BasemapToggle")
class BasemapToggle extends Accessor {
  external factory BasemapToggle(dynamic map);

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-BasemapToggle.html#toggle
  external Promise toggle();

  external JsBaseMap get activeBasemap;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-ElevationProfile.html
@JS("esri.core.widgets.ElevationProfile")
class JsElevationProfile {
  external factory JsElevationProfile(dynamic properties);

  external String get id;
}

@JS()
abstract class Promise<T> {}

extension PromiseExtension<T> on Promise<T> {
  Future<T> toFuture() => promiseToFuture(this);
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-core-Accessor.html
@JS("esri.core.Accessor")
class Accessor {
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-core-Accessor.html#get
  external dynamic get(String path);

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-core-Accessor.html#set
  external dynamic set(String path, dynamic value);

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-core-Accessor.html#watch
  external WatchHandle watch(
    String path,
    void Function(
      dynamic newValue,
      dynamic oldValue,
      String propertyName,
      dynamic target,
    ) callback,
  );
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-core-Accessor.html#WatchHandle
@JS()
class WatchHandle {
  external void remove();
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#HitTestResult
@JS()
class JsHitTestResult {
  external List<HitTestResultItem>? results;
}

@JS()
class HitTestResultItem {
  external JsGraphic? graphic;
  external JsPoint point;
}

///https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-FeatureSet.html@JS()
@JS("esri.rest.support.FeatureSet")
class JsFeatureSet {
  external Collection<JsGraphic>? features;
}

@JS("esri.layers.FeatureLayer")
class JsEditsResult {
  external dynamic addFeatureResults;
  external dynamic updateFeatureResults;
  external dynamic deleteFeatureResults;
}

@JS()
class JsHandle {
  external void remove();
}

///https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Popup.html
@JS()
class Popup {}

@JS()
@staticInterop
class WebGLRenderingContext {}

extension WebGLRenderingContextExtension on WebGLRenderingContext {
  external WebglLoseContext? getExtension(String something);
}

@JS()
@staticInterop
class WebglLoseContext {}

extension WebglLoseContextExtension on WebglLoseContext {
  external void loseContext();

  external void restoreContext();
}
