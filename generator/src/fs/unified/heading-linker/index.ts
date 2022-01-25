import { heading as isHeading } from "hast-util-heading";
import { toText } from "hast-util-to-text";
import { h } from "hastscript";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

export function headingLinker(): Transformer {
  return (node) => {
    visit(node, isHeading, (heading) => {
      const title = toText(heading);

      const link = h(
        "a",
        { id: title, href: `#${title}`, "aria-hidden": "true" },
        "🔗"
      );
      heading.children.unshift(link);
    });
  };
}
