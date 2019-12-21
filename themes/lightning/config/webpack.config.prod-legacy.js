const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

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
    })
  ]
};
