import { formatISO } from "date-fns";
import config from "../config";
import { getPostAbsolutePath, Post } from "../core/post";

export function createAtom({
  latestPosts,
  latestUpdated,
}: {
  latestPosts: Post[];
  latestUpdated: Date;
}) {
  let result =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="ja">` +
    `<title>${escape(config.title)}</title>` +
    `<link rel="alternate" href="${config.baseUrl}/"/>` +
    `<link rel="self" type="application/atom+xml" href="${config.baseUrl}/index.xml"/>` +
    `<updated>${formatISO(latestUpdated)}</updated>` +
    `<author><name>${escape(config.author.name)}</name></author>` +
    `<id>tag:www.koharakazuya.net,2021:feed</id>`;
  for (const post of latestPosts) {
    result +=
      `<entry>` +
      `<title>${escape(post.meta.title)}</title>` +
      `<link href="${config.baseUrl}${getPostAbsolutePath(post)}"/>` +
      `<id>tag:www.koharakazuya.net,2021:entry:${post.id}</id>` +
      `<updated>${formatISO(post.meta.date)}</updated>` +
      `<summary>${escape(post.summary)}</summary>` +
      `</entry>`;
  }
  result += `</feed>`;

  return result;
}

/**
 * XML の特殊文字をエスケープする
 */
function escape(x: string): string {
  return x
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
