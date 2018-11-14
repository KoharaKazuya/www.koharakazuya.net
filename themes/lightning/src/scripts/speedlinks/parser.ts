import { Content } from "./content";
import { notNull } from "../lib/notNull";

const domParser = new DOMParser();

/**
 * 与えた HTML 文字列をパースして、その中の Content を抽出する
 */
export function parseContent(text: string): Content {
  const doc = domParser.parseFromString(text, "text/html");

  const main = notNull(
    doc.querySelector<HTMLElement>("#view-main"),
    `Not Found Content section in parseContent: ${text}`
  );

  const nav = doc.querySelector<HTMLElement>("#view-nav");

  return { main, nav };
}
