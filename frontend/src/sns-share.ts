import { gaSocialOpenShare } from "./google-analytics";

export function share(): void {
  const isWebShareSupported = Boolean(navigator.share);

  // Web Share 対応かどうかによって表示するボタンを切り替える
  if (isWebShareSupported) {
    setupWithWebShare();
  } else {
    setupWithoutWebShare();
  }
}

function setupWithWebShare() {
  // DOM 要素
  // 記事ページ以外では存在しないが、長さ 0 の NodeList になるため問題ない
  const webShareButtons = document.querySelectorAll<HTMLButtonElement>(
    "[js-web-share]"
  );

  // Web Share 対応の場合は、クリックしたときに Web Share を起動するボタンを表示する
  webShareButtons.forEach((button) => {
    button.addEventListener("click", () => {
      gaSocialOpenShare("unknown");

      navigator.share({
        title: document.title,
        url: location.href,
      });
    });

    // ボタンの表示
    button.removeAttribute("hidden");
  });
}

function setupWithoutWebShare() {
  // DOM 要素
  // 記事ページ以外では存在しないが、長さ 0 の NodeList になるため問題ない
  const snsShareButtons = document.querySelectorAll<HTMLAnchorElement>(
    "[js-sns-share]"
  );

  // Web Share 非対応の場合は、各 SNS のアイコンを表示するため、Font Awesome を読み込む
  loadFontAwesomeCss();

  // Web Share 非対応の場合は、クリックしたときに各 SNS で共有するように
  snsShareButtons.forEach((a) => {
    const sns = a.getAttribute("js-sns-share")!;

    // クリックしたときに Google Analytics に情報を送る
    a.addEventListener("click", () => {
      gaSocialOpenShare(sns);
    });

    // クリックしたときの動作 (= リンク先) を設定する
    const url = encodeURIComponent(window.location.href);
    switch (sns) {
      case "facebook":
        a.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        const title = encodeURIComponent(document.title);
        a.href = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case "line":
        a.href = `https://social-plugins.line.me/lineit/share?url=${url}`;
        break;
      case "pocket":
        a.href = `https://getpocket.com/save?url=${url}`;
        break;
    }

    // ボタンの表示
    a.removeAttribute("hidden");
  });
}

function loadFontAwesomeCss() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://use.fontawesome.com/releases/v5.1.0/css/all.css";
  link.integrity =
    "sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}
