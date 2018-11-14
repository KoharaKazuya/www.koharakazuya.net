/** ヘッダー用リンクアイコンを導入済みか */
let anchorLinkIconStyleLoad = false;

/**
 * 記事内の全ての h1 - h6 の要素をアンカーリンクに変換する
 */
export function headerAnchors(): void {
  const selector = [1, 2, 3, 4, 5, 6].map(i => `article h${i}[id]`).join(",");
  [].forEach.call(
    document.querySelectorAll(selector),
    (elem: HTMLHeadingElement) => {
      const a = document.createElement("a");
      a.href = `#${encodeURIComponent(elem.id)}`;
      a.className = "header-anchor";
      elem.parentElement!.insertBefore(a, elem);
      a.appendChild(elem);
    }
  );

  loadAnchorLinkIconStyle();
}

/**
 * ヘッダー用アンカーリンクにホバーで表示するリンクアイコンのための
 * スタイルシートを導入する
 *
 * CSS で実現しない理由は以下の 2 点
 *
 * 1. iOS ではホバーで描画を変更するとダブルタップが必要になってしまうため、
 *    iOS かどうかの判定が必要
 * 2. 初期ロード CSS のサイズ抑制
 */
function loadAnchorLinkIconStyle(): void {
  if (anchorLinkIconStyleLoad) return;
  anchorLinkIconStyleLoad = true;

  // タッチデバイスなら処理を中断する (スタイルシートを導入しない)
  try {
    document.createEvent("TouchEvent");
    return; // touch device. abort
  } catch (_) {
    // non-touch device. do nothing
  }

  // スタイルシートの作成
  const style = document.createElement("style");
  style.textContent = `
    article .header-anchor,
    article .header-anchor:hover {
      display: block;
      color: initial;
      text-decoration: none;
      position: relative;
    }
    article .header-anchor:hover::before {
      position: absolute;
      left: -0.5em;
      top: 0;
      content: "🔗";
    }
  `;
  document.head!.appendChild(style);
}
