import { Element } from "hast";
import { Transformer } from "unified";
import { visit } from "unist-util-visit";
import { replaceCodePenLink } from "./codepen";
import { isCustomLinkParagraph } from "./is-custom-link";
import { replaceSpeakerDeckLink } from "./speakerdeck";
import { replaceTwitterTweetLink } from "./twitter";
import { replaceYoutubeLink } from "./youtube";

export function customLink(): Transformer {
  return (node) => {
    visit(node, isCustomLinkParagraph, (paragraph, index, parent) => {
      const text = paragraph.children[0];
      const replaced = replaceCustomLink(text.value);
      if (replaced) parent!.children[index] = replaced;
    });
  };
}

function replaceCustomLink(value: string): Element | undefined {
  const url = new URL(value);
  switch (url.host) {
    case "www.youtube.com": {
      const videoId = url.searchParams.get("v");
      if (videoId) return replaceYoutubeLink(videoId);
    }
    case "twitter.com": {
      if (/^\/[^/]+\/status\/[^/]+$/.test(url.pathname))
        return replaceTwitterTweetLink(`https://twitter.com${url.pathname}`);
    }
    case "speakerdeck.com": {
      if (/^\/player\/[^/]+$/.test(url.pathname))
        return replaceSpeakerDeckLink(`https://speakerdeck.com${url.pathname}`);
    }
    case "codepen.io": {
      const matches = url.pathname.match(/^\/([^/]+)\/[^/]+\/([^/]+)$/);
      if (matches) {
        const [, username, slug] = matches;
        return replaceCodePenLink(username, slug);
      }
    }
  }
}
