import { render, resetAnchorHooks } from "./render";
import { dispatchPagechangeEvent } from "../event/dispatcher";
import { trackScrollPosition, loadScrollPosition } from "./scrollstore";
import { onPopstateWithoutHashchange } from "./onPopstateWithoutHashchange";

/**
 * ページ内へ遷移するアンカーリンクを JavaScript でコントロールするようにし
 * 擬似的に SPA にする
 *
 * リンクはマウスホバーで遷移先ページを先読みし、メモリ内に保存する。
 *
 * リンクは一度目のクリックで JavaScript による遷移を試みるが、
 * フォールバック用に二回目のクリックはハンドリングしないして通常リンクに戻す。
 */
export function speedlinks(): void {
  // 戻る、進むボタンで表示が切り替わるように
  onPopstateWithoutHashchange(async () => {
    await render(location.href);
    loadScrollPosition();
    dispatchPagechangeEvent();
  });

  // アンカーリンクをフックする
  resetAnchorHooks();

  // スクロール位置を記憶する
  trackScrollPosition();
}
