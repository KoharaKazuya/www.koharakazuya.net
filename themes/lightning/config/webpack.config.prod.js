const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  mode: "production",

  context: path.resolve(__dirname, ".."),

  entry: {
    "list.critical": "./src/list.critical.ts",
    "single.critical": "./src/single.critical.ts",
    full: "./src/full.ts"
  },

  output: {
    path: path.resolve(__dirname, "../assets")
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                target: "es2016"
              }
            }
          }
        ],
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

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!**/*.legacy.*"]
    }),
    new MiniCssExtractPlugin()
  ]
};
