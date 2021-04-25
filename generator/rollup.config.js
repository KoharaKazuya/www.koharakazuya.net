import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: {
    dir: "build",
    format: "cjs",
    preserveModules: true,
    preserveModulesRoot: "src",
    exports: "auto",
  },

  external: [...Object.keys(pkg.dependencies), "preact/jsx-runtime"],

  plugins: [
    resolve({
      extensions: [".ts", ".tsx", ".js", ".jsx", ".es6", ".es", ".mjs"],
    }),
    commonjs(),
    babel({
      extensions: [".ts", ".tsx", ".js", ".jsx", ".es6", ".es", ".mjs"],
      babelHelpers: "bundled",
    }),
    postcss({
      plugins: [autoprefixer()],
      extract: true,
    }),
  ],
};
