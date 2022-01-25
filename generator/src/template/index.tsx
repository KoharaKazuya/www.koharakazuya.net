import { compareDesc } from "date-fns";
import { promises as fs } from "fs";
import { createRequire } from "module";
import path from "path";
import url from "url";
import { ComponentChildren } from "preact";
import renderToString from "preact-render-to-string";
import purify from "purify-css";
import App from "../components/app";
import PostComponent from "../components/post";
import PostLinks from "../components/post-links";
import TagList from "../components/tag-list";
import config from "../config";
import {
  getPostAbsolutePath,
  getTagAbsolutePath,
  Post,
  PostLink,
  Tag,
} from "../core/post";
import { Html, Template, Xml } from "../core/template";
import { createAtom } from "./atom";
import { createHtml } from "./html";
import { minifyHtml } from "./minifier";
import { createSitemap, SitemapUrl } from "./sitemap";

type Dependencies = {};

export function createTemplate({}: Dependencies): Template {
  return {
    applyIndexTemplate,
    applyTagsTemplate,
    applyPostTemplate,
    applySitemapTemplate,
    applyAtomTemplate,
  };

  async function applyIndexTemplate({
    links,
    path,
  }: {
    links: PostLink[];
    path: string;
  }): Promise<Html> {
    return applyCommonTemplate(<PostLinks links={links} />, {
      canonicalUrl: `${config.baseUrl}${path}`,
    });
  }

  async function applyTagsTemplate({ tags }: { tags: Tag[] }): Promise<Html> {
    return applyCommonTemplate(<TagList tags={tags} />, {
      canonicalUrl: `${config.baseUrl}/tags/`,
    });
  }

  async function applyPostTemplate({
    post,
    links,
  }: {
    post: Post;
    links: PostLink[];
  }): Promise<Html> {
    let { thumbnail } = post.meta;
    if (
      thumbnail &&
      !thumbnail.includes("://") &&
      !thumbnail.startsWith("//")
    ) {
      if (!thumbnail.startsWith("/"))
        thumbnail = `${getPostAbsolutePath(post)}${thumbnail.replace(
          /^\.\//,
          ""
        )}`;
      thumbnail = `${config.baseUrl}${thumbnail}`;
    }

    return applyCommonTemplate(<PostComponent post={post} links={links} />, {
      title: post.meta.title,
      thumbnail,
      canonicalUrl: `${config.baseUrl}${getPostAbsolutePath(post)}`,
    });
  }

  async function applyCommonTemplate(
    children: ComponentChildren,
    {
      title,
      thumbnail,
      canonicalUrl,
    }: { title?: string; thumbnail?: string; canonicalUrl: string }
  ): Promise<Html> {
    const app = renderToString(<App>{children}</App>);

    const componentsCss = await fs.readFile(
      path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../index.css"),
      { encoding: "utf-8" }
    );
    const prismCss = await fs.readFile(
      createRequire(import.meta.url).resolve("prismjs/themes/prism-coy.css"),
      { encoding: "utf-8" }
    );
    const inlineStyles = purify(app, componentsCss + "\n" + prismCss);

    const html = createHtml({
      title: title ?? config.title,
      authorName: config.author.name,
      description: config.description,
      thumbnail,
      canonicalUrl,
      style: inlineStyles,
      app,
      gaId: config.googleAnalytics,
    });

    return minifyHtml(html);
  }

  async function applySitemapTemplate({
    posts,
    tags,
  }: {
    posts: Post[];
    tags: Tag[];
  }): Promise<Xml> {
    const postUrls: SitemapUrl[] = posts.map((post) => ({
      loc: `${config.baseUrl}${getPostAbsolutePath(post)}`,
      lastmodDate: post.meta.date,
    }));

    const tagUrls: SitemapUrl[] = tags.map((tag) => ({
      loc: `${config.baseUrl}${getTagAbsolutePath(tag)}`,
      lastmodDate: tag.date,
    }));

    const latestmod = (urls: SitemapUrl[]) =>
      urls.map(({ lastmodDate }) => lastmodDate).sort(compareDesc)[0];

    const homeUrl: SitemapUrl = {
      loc: `${config.baseUrl}/`,
      lastmodDate: latestmod(postUrls),
    };

    const tagsUrl: SitemapUrl = {
      loc: `${config.baseUrl}/tags/`,
      lastmodDate: latestmod(tagUrls),
    };

    const urls = [...postUrls, ...tagUrls, homeUrl, tagsUrl].sort(
      (a, b) => (a.loc > b.loc ? 1 : -1) // sort by URL asc
    );

    return createSitemap({ urls });
  }

  async function applyAtomTemplate({ posts }: { posts: Post[] }): Promise<Xml> {
    const latestPosts = posts.slice(0, 10);
    const latestUpdated = posts[0].meta.date;

    return createAtom({ latestPosts, latestUpdated });
  }
}
