import { minify } from "html-minifier";

export function minifyHtml(html: string): string {
  return minify(html, htmlMinifierOptions);
}

const htmlMinifierOptions = {
  // html-webpack-plugin のものを参考にする
  // @see https://github.com/jantimon/html-webpack-plugin/blob/0a6568d587a82d88fd3a0617234ca98d26a1e0a6/index.js#L197-L206
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  // 埋め込みのスタイル、スクリプトのミニファイ
  minifyCSS: true,
  minifyJS: true,
};
