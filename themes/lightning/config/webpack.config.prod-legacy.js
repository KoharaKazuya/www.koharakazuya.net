const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",

  context: path.resolve(__dirname, ".."),

  entry: {
    "full.legacy": "./src/full.ts"
  },

  output: {
    path: path.resolve(__dirname, "../assets")
  },

  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: {
                target: "es5",
                allowJs: true
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: "null-loader"
      }
    ]
  },

  resolve: {
    extensions: [".ts", ".js"]
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*.legacy.*"]
    }),
    new webpack.ProvidePlugin({
      Promise: "core-js-pure/features/es6-promise"
    })
  ],

  devtool: "source-map"
};
