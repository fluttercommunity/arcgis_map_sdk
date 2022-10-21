const ArcGISPlugin = require("@arcgis/webpack-plugin");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [new ArcGISPlugin()],
};
