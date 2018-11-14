import { Content } from "./content";
import { parseContent } from "./parser";

type HTMLText = string;

/** ページ読み込みを高速化するためのメモリ上のキャッシュデータ */
const contentCache: { [urlHref: string]: Promise<HTMLText> } = {};

/**
 * 指定した URL のページを読み込む (キャシュ機能付き)
 */
export async function loadContent(href: string): Promise<Content> {
  let cache = contentCache[href];
  if (cache === undefined) {
    contentCache[href] = cache = fetchContent(href);
  }
  return parseContent(await cache);
}

/**
 * 指定した URL の Content を取得 (ネットワーク的に解決) する
 */
async function fetchContent(href: string): Promise<HTMLText> {
  const response = await fetch(href);
  const responseText = await response.text();
  if (response.status !== 200) {
    throw new Error(
      `NetworkError in fetchContent: ${response.status} ${responseText}`
    );
  }
  const contentType = response.headers.get("Content-Type");
  if (contentType !== null && contentType.split(";")[0] !== "text/html") {
    throw new Error(`ContentTypeError in fetchContent: ${contentType}`);
  }
  return responseText;
}
