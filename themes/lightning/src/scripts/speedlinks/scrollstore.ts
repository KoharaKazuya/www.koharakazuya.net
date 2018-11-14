import { debounce } from "debounce";

const store: { [path: string]: { top: number; left: number } } = {};

/**
 * スクロール位置を復元するために、現在の URL とスクロール位置のペアを記憶する
 */
export function trackScrollPosition(): void {
  // スクロールイベントは大量に発生するので、スクロール終了後のみ処理するように
  const save = debounce(saveScrollPosition, 300);
  window.addEventListener("scroll", save);
}

function saveScrollPosition(): void {
  const { scrollTop, scrollLeft } = document.documentElement!;
  store[location.pathname] = {
    top: scrollTop,
    left: scrollLeft
  };
}

/**
 * 以前のスクロール位置を復元する
 * 初回表示などで以前のスクロール位置データがない場合は何もしない
 */
export function loadScrollPosition(): void {
  const prevPos = store[location.pathname];
  if (!prevPos) return;

  const doc = document.documentElement!;
  doc.scrollTop = prevPos.top;
  doc.scrollLeft = prevPos.left;
}
