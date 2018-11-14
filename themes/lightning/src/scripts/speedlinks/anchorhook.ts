type Callback = () => void;
interface AnchorEventHandler {
  click: Callback;
  mouseenter: Callback;
}

/**
 * 指定したアンカーリンクのクリックを奪い、コールバックを実行する
 *
 * @return 登録を解除する関数
 */
export function addAnchorHook(
  link: HTMLAnchorElement,
  handler: AnchorEventHandler
): Callback {
  if (
    link.hostname !== location.hostname || // 外部リンクはフックしない
    (link.pathname === location.pathname && link.hash) // ページ内 hash リンクはフックしない
  )
    return () => {};

  // クリック時
  const clickHandler = (event: MouseEvent) => {
    // 通常のイベント (画面遷移) をキャンセル
    event.preventDefault();
    event.stopPropagation();

    // クリックを奪うのは 1 回のみ
    removeListeners();

    try {
      handler.click();
    } catch (err) {
      // ハンドラーの実行に失敗した場合はフォールバックとして画面遷移する
      console.warn(err);
      location.href = link.href;
    }
  };

  // マウスホバー時
  const enterHandler = () => {
    handler.mouseenter();
  };

  link.addEventListener("click", clickHandler);
  link.addEventListener("mouseenter", enterHandler);

  const removeListeners = () => {
    link.removeEventListener("click", clickHandler);
    link.removeEventListener("mouseenter", enterHandler);
  };
  return removeListeners;
}
