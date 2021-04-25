import { promises as fs } from "fs";
import globAsync from "glob";
import path from "path";
import { promisify } from "util";
import { FileSystem } from "../core/fs";
import { Page } from "../core/page";
import { Post } from "../core/post";
import {
  contentRoot,
  frontendRoot,
  outputRoot,
  staticRoot,
} from "./path-config";
import { compilePost } from "./post-compiler";

const glob = promisify(globAsync);

type Dependencies = {};

export function createFileSystemAdaptor({}: Dependencies): FileSystem {
  return {
    scanPosts,
    writePages,
    copyAssets,
    removePreviousFiles,
    removeEmptyDirectories,
  };

  async function scanPosts(): Promise<Post[]> {
    const files = await glob("**/index.md", { cwd: contentRoot });

    const posts = await Promise.all(
      files.map(async (file) => compilePost(file.replace(/\/index\.md$/, "")))
    );

    return posts;
  }

  async function writePages(pages: Page[]): Promise<void> {
    await Promise.all(
      pages.map(async (page) => {
        let { absolutePath } = page;
        if (absolutePath.endsWith("/")) absolutePath += "index.html";

        const file = path.join(outputRoot, absolutePath);
        const dir = path.dirname(file);

        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(file, page.content, { encoding: "utf-8" });
      })
    );
  }

  async function copyAssets(): Promise<void> {
    const [contentAssets, staticAssets, frontendAssets] = await Promise.all([
      glob("**/*", {
        cwd: contentRoot,
        nodir: true,
        ignore: "**/index.md",
      }),
      glob("**/*", {
        cwd: staticRoot,
        nodir: true,
      }),
      glob("**/*", {
        cwd: frontendRoot,
        nodir: true,
      }),
    ]);

    const targets = [
      ...contentAssets.map((f) => ({
        from: path.join(contentRoot, f),
        to: path.join(outputRoot, f),
      })),
      ...staticAssets.map((f) => ({
        from: path.join(staticRoot, f),
        to: path.join(outputRoot, f),
      })),
      ...frontendAssets.map((f) => ({
        from: path.join(frontendRoot, f),
        to: path.join(outputRoot, f),
      })),
    ];

    await Promise.all(
      targets.map(async ({ from, to }) => {
        const dir = path.dirname(to);
        await fs.mkdir(dir, { recursive: true });
        await fs.copyFile(from, to);
      })
    );
  }

  async function removePreviousFiles(): Promise<void> {
    const files = await glob("**/*", { cwd: outputRoot, nodir: true });
    await Promise.all(files.map((file) => fs.rm(path.join(outputRoot, file))));
  }

  async function removeEmptyDirectories(): Promise<void> {
    const dirs = new Set(await glob("**/*/", { cwd: outputRoot }));

    LOOP: while (true) {
      for (const entry of dirs) {
        const dir = path.join(outputRoot, entry);
        const files = await fs.readdir(dir);
        if (files.length === 0) {
          await fs.rmdir(dir);
          dirs.delete(entry);
          continue LOOP;
        }
      }
      break;
    }
  }
}
