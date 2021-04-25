import { getPostAbsolutePath, Post, PostLink, Tag } from "./post";
import { Template } from "./template";

/**
 * エンドユーザーが見る 1 ページ
 */
export interface Page {
  absolutePath: string;
  content: string;
}

type Dependencies = {
  template: Template;
};

export function createPageGenerator({ template }: Dependencies) {
  return {
    generateIndexPage,
    generateTagsPage,
    generateTagPage,
    generatePostPage,
    generateSitemapPage,
    generateAtomPage,
  };

  async function generateIndexPage({
    posts,
  }: {
    posts: Post[];
  }): Promise<Page> {
    const path = "/";
    const links = await Promise.all(posts.map(createLink));
    const content = await template.applyIndexTemplate({ links, path });

    return { absolutePath: path, content };
  }

  async function generateTagsPage({ tags }: { tags: Tag[] }): Promise<Page> {
    const content = await template.applyTagsTemplate({ tags });

    return { absolutePath: "/tags/", content };
  }

  async function generateTagPage({
    tag,
    posts,
  }: {
    tag: Tag;
    posts: Post[];
  }): Promise<Page> {
    const path = `/tags/${tag.id}/`;
    const links = await Promise.all(posts.map(createLink));
    const content = await template.applyIndexTemplate({ links, path });

    return { absolutePath: path, content };
  }

  async function generatePostPage({
    post,
    relatedPosts,
  }: {
    post: Post;
    relatedPosts: Post[];
  }): Promise<Page> {
    const links = await Promise.all(relatedPosts.map(createLink));
    const content = await template.applyPostTemplate({ post: post, links });

    return { absolutePath: getPostAbsolutePath(post), content };
  }

  async function createLink(post: Post): Promise<PostLink> {
    return {
      absolutePath: getPostAbsolutePath(post),
      title: post.meta.title,
      date: post.meta.date,
      thumbnail: post.meta.thumbnail,
      summary: post.summary,
    };
  }

  async function generateSitemapPage({
    posts,
    tags,
  }: {
    posts: Post[];
    tags: Tag[];
  }): Promise<Page> {
    return {
      absolutePath: "/sitemap.xml",
      content: await template.applySitemapTemplate({ posts, tags }),
    };
  }

  async function generateAtomPage({ posts }: { posts: Post[] }): Promise<Page> {
    return {
      absolutePath: "/index.xml",
      content: await template.applyAtomTemplate({ posts }),
    };
  }
}

export type PageGenerator = ReturnType<typeof createPageGenerator>;
