import rehypePrisim from "@mapbox/rehype-prism";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remark2rehype from "remark-rehype";
import unified from "unified";
import { codeBlockDefaultLanguage } from "./code-block-default-language";
import { customLink } from "./custom-link";
import { headingLinker } from "./heading-linker";
import { imageOptimizer } from "./image-optimizer";

const processer = unified()
  .use(remarkParse)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(codeBlockDefaultLanguage)
  .use(rehypePrisim, { ignoreMissing: true })
  .use(headingLinker)
  .use(imageOptimizer)
  .use(customLink)
  .use(rehypeStringify, { allowDangerousHtml: true });

type Markdown = {
  contents: string;
  path: string;
};

export async function md2html(markdown: Markdown): Promise<string> {
  return String(await processer.process(markdown));
}
