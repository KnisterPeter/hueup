const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const WorkboxPlugin = require("workbox-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");

const dev = process.env.NODE_ENV === "production";

/**
 * @type {webpack.Configuration}
 */
const config = {
  mode: dev ? "development" : "production",
  entry: "./src/index.tsx",
  devtool: dev ? "source-map" : false,
  devServer: {
    contentBase: "./dist",
    port: 1234
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.woff2?$/,
        use: "file-loader"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat"
    }
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js"
  },
  plugins: [
    !dev &&
      new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: false }),
    new HtmlWebpackPlugin({
      title: "hue up",
      template: "./src/index.html"
    }),
    new WebpackPwaManifest({
      name: "hue up",
      short_name: "hue up",
      description: "Conigure your Hue network",
      crossorigin: "anonymous",
      display: "standalone"
    }),
    new WorkboxPlugin.GenerateSW({
      importWorkboxFrom: "local",
      clientsClaim: true,
      skipWaiting: true
    })
  ].filter(Boolean)
};

module.exports = config;
