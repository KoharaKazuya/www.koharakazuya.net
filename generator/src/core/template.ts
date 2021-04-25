import { Post, PostLink, Tag } from "./post";

export type Html = string;
export type Xml = string;

export interface Template {
  applyIndexTemplate(opts: { links: PostLink[]; path: string }): Promise<Html>;
  applyTagsTemplate(opts: { tags: Tag[] }): Promise<Html>;
  applyPostTemplate(opts: { post: Post; links: PostLink[] }): Promise<Html>;
  applySitemapTemplate(opts: { posts: Post[]; tags: Tag[] }): Promise<Xml>;
  applyAtomTemplate(opts: { posts: Post[] }): Promise<Xml>;
}
