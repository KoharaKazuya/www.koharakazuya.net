import path from "path";
import url from "url";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
export const contentRoot = path.join(dirname, "../../../content");
export const staticRoot = path.join(dirname, "../../../static");
export const frontendRoot = path.join(dirname, "../../../frontend/dist");
export const outputRoot = path.join(dirname, "../../../public");
