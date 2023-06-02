import SceneLayer from "@arcgis/core/layers/GraphicsLayer";

const load = () => {
  window.GraphicsLayer = GraphicsLayer;
};

export { load };
