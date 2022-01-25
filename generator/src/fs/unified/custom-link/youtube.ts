import { h } from "hastscript";
import { containerStyle, iframeStyle } from "./styles";

export function replaceYoutubeLink(videoId: string) {
  const src = `https://www.youtube.com/embed/${videoId}`;
  return h(
    "div",
    { style: containerStyle },
    h("iframe", {
      src,
      allowfullscreen: true,
      loading: "lazy",
      style: iframeStyle,
    })
  );
}
