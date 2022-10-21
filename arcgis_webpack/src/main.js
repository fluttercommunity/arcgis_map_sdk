import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Point from "@arcgis/core/geometry/Point";
import Attribution from "@arcgis/core/widgets/Attribution";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import * as intl from "@arcgis/core/intl";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import Basemap from "@arcgis/core/Basemap";

window.esri = {
  'core': {
    'Map': Map,
    'config': esriConfig,
    'views': {
      'MapView': MapView,
    },
    'geometry': {
      'Point': Point,
    },
    'widgets': {
      'Attribution': Attribution,
      'BasemapToggle': BasemapToggle,
      'BasemapGallery': BasemapGallery,
    },
    'layers': {
      VectorTileLayer: VectorTileLayer
    },
    'Basemap': Basemap,
    'intl': intl
  },
}

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
