import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import Point from "@arcgis/core/geometry/Point";
import Attribution from "@arcgis/core/widgets/Attribution";
import Compass from "@arcgis/core/widgets/Compass";
import ElevationProfile from "@arcgis/core/widgets/ElevationProfile";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import * as intl from "@arcgis/core/intl";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import Basemap from "@arcgis/core/Basemap";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import Extent from "@arcgis/core/geometry/Extent";

window.esri = {
  'core': {
    'Map': Map,
    'config': esriConfig,
    'views': {
      'MapView': MapView,
      'SceneView': SceneView,
    },
    'geometry': {
      'Point': Point,
      'Extent': Extent,
    },
    'widgets': {
      'Attribution': Attribution,
      'BasemapToggle': BasemapToggle,
      'BasemapGallery': BasemapGallery,
      'Compass': Compass,
      'ElevationProfile': ElevationProfile,
    },
    'layers': {
      VectorTileLayer: VectorTileLayer,
      SceneLayer: SceneLayer,
      GraphicsLayer: GraphicsLayer,
    },
    'Basemap': Basemap,
    'intl': intl,
    'reactiveUtils': reactiveUtils
  },
}

window.loadGraphicsLayer = () => {
  return new Promise(function (resolve) {
    import("./graphicsLayer").then((module) => {
      module.load();
      resolve();
    });
  });
};

window.loadSceneLayer = () => {
  return new Promise(function (resolve) {
    import("./sceneLayer").then((module) => {
      module.load();
      resolve();
    });
  });
};

window.loadFeatureLayer = () => {
  return new Promise(function (resolve) {
    import("./featureLayer").then((module) => {
      module.load();
      resolve();
    });
  });
};

window.loadMapImageLayer = () => {
  return new Promise(function (resolve) {
    import("./mapImageLayer").then((module) => {
      module.load();
      resolve();
    });
  });
};
