import { h } from "hastscript";

export function replaceTwitterTweetLink(url: string) {
  return h("div", { style: "margin: 2rem 0;" }, [
    h(
      "blockquote",
      { class: "twitter-tweet tw-align-center" },
      h("a", { href: url }, url)
    ),
    h("script", {
      async: true,
      src: "https://platform.twitter.com/widgets.js",
      charset: "utf-8",
    }),
  ]);
}
