import { eventPagechange } from "../event/types";

let pageChangeListen = false;
let prevPathname: string;

/**
 * 戻る進むボタンなどで発火するコールバックを登録する
 * hash リンクなどで発生するイベントでは発火しない
 */
export function onPopstateWithoutHashchange(callback: () => void): void {
  // prevPathname を最新に保つ
  if (!pageChangeListen) {
    pageChangeListen = true;

    prevPathname = location.pathname;
    window.addEventListener(
      eventPagechange,
      () => (prevPathname = location.pathname)
    );
  }

  window.addEventListener("popstate", () => {
    // hash リンクでも popstate イベントが発生するので、同じパス内での遷移の場合は無視するように
    if (location.pathname === prevPathname) return;

    callback();
  });
}
