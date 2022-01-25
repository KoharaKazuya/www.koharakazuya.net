import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";
import { Post, unmarshalMeta } from "../core/post";
import { html2summary } from "./html-to-text";
import { contentRoot } from "./path-config";
import { md2html } from "./unified";

export async function compilePost(id: string): Promise<Post> {
  const sourcePath = path.join(contentRoot, id, "index.md");

  const source = await fs.readFile(sourcePath, { encoding: "utf-8" });
  const { data, content: markdown } = matter(source);
  const meta = unmarshalMeta(data);

  const content = await md2html({ value: markdown, path: sourcePath });
  const summary = await html2summary(content);

  return { id, meta, content, summary };
}
