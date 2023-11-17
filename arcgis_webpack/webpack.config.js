const ArcGISPlugin = require("@arcgis/webpack-plugin");
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const rimraf = require('rimraf');
const outputPath = "../arcgis_map_sdk_web/assets/arcgis_js_api_custom_build";

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    path: path.resolve(__dirname, outputPath),
    filename: "[name].js",
  },
  plugins: [
    new ArcGISPlugin(),
    new (class {
      apply(compiler) {
        compiler.hooks.done.tap('Remove LICENSE', () => {
          console.log('Remove LICENSE.txt');
          rimraf.sync('./dist/**/*.LICENSE.txt');
        });
      }
    })(),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      },
      extractComments: false,
    })],
  },
};
