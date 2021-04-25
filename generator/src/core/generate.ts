import { compareDesc } from "date-fns";
import { FileSystem } from "./fs";
import { PageGenerator } from "./page";
import { getTags, groupByTag } from "./post";

type Dependencies = {
  fs: FileSystem;
  pageGenerator: PageGenerator;
};

export function createGenerator({ fs, pageGenerator }: Dependencies) {
  return async function generate(): Promise<void> {
    await fs.removePreviousFiles();

    const posts = await fs.scanPosts();

    // sort by date
    posts.sort((a, b) => compareDesc(a.meta.date, b.meta.date));
    const latestPosts = posts.slice(0, 5);

    const tags = getTags({ posts });

    const [
      indexPage,
      tagsPage,
      tagPages,
      postPages,
      sitemapPage,
      atomPage,
    ] = await Promise.all([
      pageGenerator.generateIndexPage({ posts }),
      pageGenerator.generateTagsPage({ tags }),
      Promise.all(
        groupByTag({ posts: posts }).map(({ tag, posts }) =>
          pageGenerator.generateTagPage({ tag, posts })
        )
      ),
      Promise.all(
        posts.map((post) =>
          pageGenerator.generatePostPage({ post, relatedPosts: latestPosts })
        )
      ),
      pageGenerator.generateSitemapPage({ posts, tags }),
      pageGenerator.generateAtomPage({ posts }),
    ]);

    await fs.writePages([
      indexPage,
      tagsPage,
      ...tagPages,
      ...postPages,
      sitemapPage,
      atomPage,
    ]);
    await fs.copyAssets();

    await fs.removeEmptyDirectories();
  };
}
