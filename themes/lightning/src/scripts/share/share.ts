import { gaSocialOpenShare } from "../lib/google-analytics";

interface Navigator {
  share: (options: {}) => Promise<unknown>;
}
declare var navigator: Navigator;

export function share(): void {
  // Web Share 未対応の場合は、何も表示しないままで中断する
  if (!navigator.share) return;

  // シェアボタンを配置する要素を選択する
  const parent = document.querySelector(".share");
  if (!parent) return; // 記事ページ以外では見つからないので中断する

  // Web Share 対応の場合は、クリックしたときに Web Share を起動するボタンを表示する
  const element = createShareButton();
  parent.appendChild(element);
}

function createShareButton() {
  const element = document.createElement("button");
  element.type = "button";
  element.className = "share-button";
  element.textContent = "この記事をシェアする";

  element.addEventListener("click", () => {
    gaSocialOpenShare("unknown");

    navigator.share({
      title: document.title,
      url: location.href
    });
  });

  return element;
}
