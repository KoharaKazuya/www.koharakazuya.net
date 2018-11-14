import { Content } from "./content";
import { loadContent } from "./loader";
import { addAnchorHook } from "./anchorhook";
import { notNull } from "../lib/notNull";
import { dispatchPagechangeEvent } from "../event/dispatcher";
import { loadScrollPosition } from "./scrollstore";

/** アンカーリンクに設定された JavaScript でのフックを削除する関数一覧 */
let hookRemovers: Array<() => void> = [];

/**
 * 指定した URL を画面に表示する
 */
export async function render(href: string): Promise<void> {
  showLoading();
  swapContent(await loadContent(href));
  resetAnchorHooks();
}

/**
 * 画面内全てのアンカーリンクを JavaScript で制御するように設定する
 * JavaScript の制御により SPA 化される。
 */
export function resetAnchorHooks(): void {
  hookRemovers.forEach(r => r());
  hookRemovers = [];

  [].forEach.call(document.querySelectorAll("a"), (a: HTMLAnchorElement) =>
    hookRemovers.push(
      addAnchorHook(a, {
        click: async () => {
          await render(a.href);
          history.pushState({}, "", a.href);
          window.scrollTo(0, 0);
          dispatchPagechangeEvent();
        },
        mouseenter: () => {
          loadContent(a.href);
        }
      })
    )
  );
}

/**
 * ローディング中を示すトランジションを表示する
 */
function showLoading(): void {
  document.querySelector("#view-main")!.classList.add("swapping");
}

/**
 * 指定した Content で現在の DOM 上の Content を入れ替える
 */
function swapContent(newContent: Content): void {
  // 現在の Content を取得する
  const oldMain = notNull(
    document.querySelector("#view-main"),
    "Not Found Content section in swapContent"
  );
  const mainContainer = notNull(
    oldMain.parentElement,
    "Not Found Container section in swapContent"
  );
  const oldNav = document.querySelector("#view-nav");

  // 新しい Content を追加する
  mainContainer.insertBefore(newContent.main, oldMain);
  if (newContent.nav) mainContainer.insertBefore(newContent.nav, oldMain);

  // 古い Content を削除する
  mainContainer.removeChild(oldMain);
  if (oldNav) mainContainer.removeChild(oldNav);
}
