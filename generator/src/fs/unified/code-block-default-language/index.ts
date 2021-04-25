import type { Element } from "hast";
import type { Transformer } from "unified";
import type { Parent } from "unist";
import visit from "unist-util-visit";

/**
 * 言語が指定されてないコードブロックも Prism で装飾するために、デフォルトの言語指定を追加する
 */
export function codeBlockDefaultLanguage(): Transformer {
  return (node) => {
    visit(node, isCodeBlock, (code) => {
      const className = code.properties?.className;
      if (
        Array.isArray(className) &&
        className
          .filter((n): n is string => typeof n === "string")
          .some((n) => n.match(/^language-/))
      )
        return;

      code.properties = code.properties || {};
      code.properties.className = code.properties.className || [];
      (code.properties.className as string[]).push("language-text");
    });
  };
}

type Code = Element & { tagName: "code" };

function isCodeBlock(
  node: unknown,
  index?: number,
  parent?: Parent
): node is Code {
  if (typeof node !== "object") return false;
  if (node === null) return false;
  if ((node as any).type !== "element") return false;
  if ((node as any).tagName !== "code") return false;

  if (!parent) return false;
  if (parent.type !== "element") return false;
  if (parent.tagName !== "pre") return false;
  if (parent.children.length !== 1) return false;

  return true;
}
