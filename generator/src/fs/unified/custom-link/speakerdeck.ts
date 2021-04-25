import h from "hastscript";
import { containerStyle, iframeStyle } from "./styles";

export function replaceSpeakerDeckLink(src: string) {
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
