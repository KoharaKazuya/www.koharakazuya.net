// eleventy-high-performance-blog を参考に実装
// @see https://github.com/google/eleventy-high-performance-blog/blob/eb1f9c11763022719b44ba2715b1e5f60f73baa1/_11ty/blurry-placeholder.js

import DataURIParser from "datauri/parser.js";
import type { Sharp } from "sharp";

const dataUriParser = new DataURIParser();

type Size = { width: number; height: number };

/** プレイスホルダー画像のピクセル数の目標値 (かならずこのピクセル数になるとは限らない) */
const placeholderPixelTarget = 60;

function getPlaceholderSize(imageSize: Size): Size {
  const { width, height } = imageSize;
  const ratio = width / height;
  const placeholderHeight = Math.sqrt(placeholderPixelTarget / ratio);
  const placeholderWidth = placeholderPixelTarget / placeholderHeight;
  return {
    width: Math.round(placeholderWidth),
    height: Math.round(placeholderHeight),
  };
}

export async function getPlaceholderDataURI(image: Sharp): Promise<string> {
  const { width, height } = await image.metadata();
  if (!width || !height) throw new Error("unsized image");

  const { width: pw, height: ph } = getPlaceholderSize({ width, height });
  const buffer = await image.resize(pw, ph).png().toBuffer();
  const placeholderUri = dataUriParser.format(".png", buffer).content;
  if (!placeholderUri) throw new Error("empty data URI for placeholder");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 ${width} ${height}">
      <filter id="a" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="1 1"></feFuncA>
        </feComponentTransfer>
      </filter>
      <image filter="url(#a)" preserveAspectRatio="none"
        height="100%" width="100%"
        xlink:href="${placeholderUri}">
      </image>
    </svg>
  `
    // 余計な空白を除去
    .replace(/\s+/g, " ")
    .replace(/> </g, "><");

  const svgUri = dataUriParser.format(".svg", svg).content;
  if (!svgUri) throw new Error("empty data URI for svg");

  return svgUri;
}
