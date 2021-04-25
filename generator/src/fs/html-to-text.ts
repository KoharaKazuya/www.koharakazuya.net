import { htmlToText } from "html-to-text";

export async function html2summary(html: string): Promise<string> {
  const text = htmlToText(html, {
    tags: {
      a: { options: { ignoreHref: true } },
      img: { format: "skip" },
    },
  });
  return text.substring(0, 120);
}
