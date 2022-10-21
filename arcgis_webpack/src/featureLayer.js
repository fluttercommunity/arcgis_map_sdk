import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const load = () => {
  window.FeatureLayer = FeatureLayer;
};

export { load };
