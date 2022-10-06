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

@JS("FeatureLayer")
class JsFeatureLayer {
  external factory JsFeatureLayer(dynamic map);

  external Promise<JsFeatureSet> queryFeatures();

  external Promise<void> applyEdits(dynamic data);

  external void destroy();

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
}

@JS("esri.core.Collection")
class Collection<T> {
  external T? find(Function callback);

  external int findIndex(Function callback);

  external void forEach(Function collection);

  external void removeAt(int index);

  external void add(dynamic graphics, [int? index]);
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html
@JS("esri.Graphic")
abstract class JsGraphic extends Accessor {
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html#geometry
  external JsGeometry get geometry;

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html#attributes
  external dynamic attributes;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Geometry.html
@JS("esri.geometry.Geometry")
abstract class JsGeometry {
  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Geometry.html#extent
  external JsExtent get extent;
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

@JS("esri.core.views.MapView")
class JsMapView extends Accessor {
  external factory JsMapView(dynamic map);

  external double get zoom;

  external set padding(dynamic padding);

  external DefaultUI get ui;

  external dynamic get padding;

  external Handle on(List<String> event, void Function(dynamic) callback);

  external Promise<JsHitTestResult> hitTest(dynamic event);

  external Promise<Object?> goTo(dynamic target, [dynamic targetOptions]);

  external Collection<JsGraphic> get graphics;

  external String get id;

  external dynamic get components;

  external set components(dynamic components);

  external Object get center;
}

/// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-BasemapToggle.html
@JS("esri.core.widgets.BasemapToggle")
class BasemapToggle {
  external factory BasemapToggle(dynamic map);

  /// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-BasemapToggle.html#toggle
  external void toggle();
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
    void Function(dynamic newValue, dynamic oldValue, String propertyName, dynamic target) callback,
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
  external JsGraphic graphic;
  external JsPoint point;
}

///https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-FeatureSet.html@JS()
@JS("esri.rest.support.FeatureSet")
class JsFeatureSet {
  external dynamic features;
}

@JS()
class Handle {
  external void remove();
}
