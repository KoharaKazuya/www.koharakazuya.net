import { isAfter, parseISO } from "date-fns";
import { array, assert, Describe, object, optional, string } from "superstruct";

/**
 * ブログ記事
 */
export interface Post {
  id: string;
  meta: Meta;
  /** 記事内容の HTML */
  content: string;
  /** 記事内容の概要文 */
  summary: string;
}

/**
 * ブログ記事の URL のパス部分
 */
export function getPostAbsolutePath(self: Post): string {
  return `/${self.id}/`;
}

/**
 * ブログ記事のメタデータ
 */
export interface Meta {
  date: Date;
  title: string;
  thumbnail?: string;
  tags?: string[];
}

interface SerializedMeta {
  date: string;
  title: string;
  thumbnail?: string;
  tags?: string[];
}

const MetaSchema: Describe<SerializedMeta> = object({
  date: string(),
  title: string(),
  thumbnail: optional(string()),
  tags: optional(array(string())),
});

export function unmarshalMeta(x: unknown): Meta {
  assert(x, MetaSchema);
  const date = parseISO(x.date);
  return { ...x, date };
}

/**
 * ブログ記事へのリンク
 */
export interface PostLink {
  absolutePath: string;
  title: string;
  date: Date;
  thumbnail?: string;
  summary: string;
}

export interface Tag {
  id: string;
  title: string;
  date: Date;
}

export function getTags({ posts }: { posts: Post[] }): Tag[] {
  return groupByTag({ posts }).map(({ tag }) => tag);
}

export function groupByTag({
  posts,
}: {
  posts: Post[];
}): Array<{ tag: Tag; posts: Post[] }> {
  const ret: Array<{ tag: Tag; posts: Post[] }> = [];
  for (const post of posts) {
    for (const title of post.meta.tags ?? []) {
      const id = urlize(title);
      const found = ret.find(({ tag }) => tag.id === id);
      if (found) {
        found.posts.push(post);
        if (isAfter(post.meta.date, found.tag.date))
          found.tag.date = post.meta.date;
      } else {
        ret.push({ tag: { id, title, date: post.meta.date }, posts: [post] });
      }
    }
  }
  return ret;
}

export function urlize(title: Tag["title"]): string {
  return (
    title
      .toLowerCase()
      // .replaceAll(" ", "-")
      .split(" ")
      .join("-")
  );
}

export function getTagAbsolutePath(self: Tag): string {
  return `/tags/${self.id}/`;
}
