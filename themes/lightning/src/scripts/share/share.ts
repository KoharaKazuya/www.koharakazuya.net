import { gaSocialOpenShare } from "../lib/google-analytics";

interface Navigator {
  share: (options: {}) => Promise<unknown>;
}
declare var navigator: Navigator;

export function share(): void {
  // Web Share 未対応の場合は、ボタンとその表示領域を消す
  if (!navigator.share) {
    document.querySelector(".share")!.remove();
    return;
  }

  // Web Share 対応の場合は、ボタンをクリックしたときに Web Share を起動する
  document.querySelector(".share-button")!.addEventListener("click", () => {
    gaSocialOpenShare("unknown");

    navigator.share({
      title: document.title,
      url: location.href
    });
  });
}
