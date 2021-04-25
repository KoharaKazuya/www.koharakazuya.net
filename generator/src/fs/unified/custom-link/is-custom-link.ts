import { Element, Text } from "hast";

export type CustomLinkParagraph = Element & {
  tagName: "p";
  children: [Text];
};

export function isCustomLinkParagraph(node: any): node is CustomLinkParagraph {
  if (typeof node !== "object" || node === null) return false;
  if (node.type !== "element" || node.tagName !== "p") return false;
  const p = node as Element;
  if (p.children.length !== 1) return false;
  if (p.children[0].type !== "text" || !isURL(p.children[0].value))
    return false;
  return true;
}

function isURL(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}
