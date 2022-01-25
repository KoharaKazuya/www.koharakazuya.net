import { h } from "hastscript";
import { containerStyle, iframeStyle } from "./styles";

export function replaceCodePenLink(username: string, slug: string) {
  return h(
    "div",
    { style: containerStyle },
    h("iframe", {
      src: `https://codepen.io/${username}/embed/${slug}`,
      allowfullscreen: true,
      loading: "lazy",
      style: iframeStyle,
    })
  );
}
