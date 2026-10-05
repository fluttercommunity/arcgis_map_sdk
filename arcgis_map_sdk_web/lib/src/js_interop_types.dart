import 'dart:js_interop';

extension type JsViewEvent(JSObject _) implements JSObject {
  external void stopPropagation();
}

extension type JsFeatureSet(JSObject _) implements JSObject {
  external JsCollectionInterop? get features;
}

extension type JsHitTestResult(JSObject _) implements JSObject {
  external JSArray<HitTestResultItem>? get results;
}

extension type HitTestResultItem(JSObject _) implements JSObject {
  external JsGraphicInterop? get graphic;

  external JsPointInterop get point;
}

extension type JsGraphicInterop(JSObject _) implements JSObject {
  external JsAttributesInterop get attributes;

  external JsGeometryInterop get geometry;

  external void set(String path, JSAny? value);
}

extension type JsAttributesInterop(JSObject _) implements JSObject {
  external String get id;
}

extension type JsGeometryInterop(JSObject _) implements JSObject {
  external JsExtentInterop get extent;
}

extension type JsExtentInterop(JSObject _) implements JSObject {
  external JsPointInterop get center;

  external double get height;

  external double get width;

  external bool contains(JSObject geometry);

  external bool intersects(JsExtentInterop geometry);
}

extension type JsPointInterop(JSObject _) implements JSObject {
  external double get latitude;

  external double get longitude;
}

extension type JsGraphicsLayerInterop(JSObject _) implements JSObject {
  external JsCollectionInterop? get graphics;

  external void remove(JSObject graphic);

  external void removeAll();
}

extension type JsLayerInterop(JSObject _) implements JSObject {
  external String get id;

  external String get type;

  external String get url;

  external void destroy();
}

extension type JsCollectionInterop(JSObject _) implements JSObject {
  external JsGraphicInterop? find(JSFunction callback);

  external JsCollectionInterop? filter(JSFunction callback);

  external void forEach(JSFunction callback);

  external void removeMany(JsCollectionInterop? items);

  external void add(JSAny? item, [int? index]);
}
