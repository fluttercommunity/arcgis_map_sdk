import MapImageLayer from "@arcgis/core/layers/MapImageLayer";

const load = () => {
  window.MapImageLayer = MapImageLayer;
};

export { load };
