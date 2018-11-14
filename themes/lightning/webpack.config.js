const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",

  entry: {
    "list.critical": "./src/list.critical.ts",
    "single.critical": "./src/single.critical.ts",
    full: "./src/full.ts"
  },

  output: {
    path: __dirname + "/assets"
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")({ grid: true })]
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: [".ts", ".js"]
  },

  plugins: [new CleanWebpackPlugin(["assets"]), new MiniCssExtractPlugin()]
};
