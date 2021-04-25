/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
  mode: "production",

  entry: "./src/main.ts",
  output: {
    filename: "main.js",
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
                    targets: { esmodules: true },
                    bugfixes: true,
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
