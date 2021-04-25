import { Page } from "./page";
import { Post } from "./post";

export interface FileSystem {
  scanPosts(): Promise<Post[]>;
  writePages(pages: Page[]): Promise<void>;
  copyAssets(): Promise<void>;
  removePreviousFiles(): Promise<void>;
  removeEmptyDirectories(): Promise<void>;
}
