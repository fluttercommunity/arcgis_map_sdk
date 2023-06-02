import SceneLayer from "@arcgis/core/layers/SceneLayer";

const load = () => {
  window.SceneLayer = SceneLayer;
};

export { load };
