declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "purify-css" {
  export default function purify(content: string, css: string): string;
}

declare module "hast-util-heading" {
  type HeadingTagName = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "hgroup";
  type Heading = import("hast").Element & { tagName: HeadingTagName };

  export default function heading(node: unknown): node is Heading;
}

declare module "hast-util-to-text" {
  export default function toText(node: unknown): string;
}

declare module "@mapbox/rehype-prism" {
  export default function rehypePrism(...args: any[]): any;
}
