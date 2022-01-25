import type { Element } from "hast";
import path from "path";
import sharp from "sharp";
import { Transformer } from "unified";
import { visit } from "unist-util-visit";
import { getPlaceholderDataURI } from "./placeholder";

export function imageOptimizer(): Transformer {
  return async (node, file) => {
    const filePath = file.path;
    if (!filePath) return;
    const dirPath = path.dirname(filePath);

    const tasks: Array<Promise<void>> = [];
    visit(node, isRelativePathImageNode, (img) => {
      tasks.push(optimize(img));
    });
    await Promise.all(tasks);

    async function optimize(img: Image): Promise<void> {
      const imagePath = path.join(dirPath, img.properties.src);
      const image = sharp(imagePath);
      const { width, height } = await image.metadata();
      if (!width || !height) return;

      img.properties.loading = "lazy";
      img.properties.width = String(width);
      img.properties.height = String(height);

      const dataUri = await getPlaceholderDataURI(image);
      img.properties.style = `background-size:cover;background-image:url("${dataUri}")`;
    }
  };
}

type Image = Element & {
  tagName: "img";
  properties: Element["properties"] & { src: string };
};

function isRelativePathImageNode(node: unknown): node is Image {
  if (typeof node !== "object") return false;
  if (node === null) return false;
  if ((node as any).type !== "element") return false;
  if ((node as any).tagName !== "img") return false;
  const src: unknown = (node as any).properties?.src;
  if (typeof src !== "string") return false;
  if (src.includes("://")) return false;
  if (src.startsWith("/")) return false;
  return true;
}
