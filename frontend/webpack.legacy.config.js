/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
  mode: "production",

  entry: "./src/main.ts",
  output: {
    filename: "main.legacy.js",
  },

  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-typescript",
                [
                  "@babel/preset-env",
                  {
                    targets: "defaults",
                    bugfixes: true,
                    useBuiltIns: "usage",
                    corejs: 3,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".wasm", ".mjs", ".js", ".json"],
  },
};
