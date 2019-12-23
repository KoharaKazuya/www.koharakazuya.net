const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  mode: "development",

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
              transpileOnly: true,
              compilerOptions: {
                target: "es2016",
                sourceMap: true
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

  plugins: [new MiniCssExtractPlugin()],

  devtool: "eval-source-map"
};
