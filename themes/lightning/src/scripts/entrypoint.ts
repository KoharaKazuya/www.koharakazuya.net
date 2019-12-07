import { contentLoaded } from "document-promises";
import { speedlinks } from "./speedlinks/speedlinks";
import { codeHighlight } from "./codehighlight/codehighlight";
import { eventPagechange } from "./event/types";
import { gaTrackPagePath, gaTrackErrors } from "./lib/google-analytics";
import { headerAnchors } from "./headeranchors/headeranchors";
import { share } from "./share/share";

// エラー情報収集
gaTrackErrors();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}

contentLoaded.then(() => {
  // 疑似 SPA 化
  speedlinks();

  // ヘッダーのリンク化
  window.addEventListener(eventPagechange, headerAnchors);
  headerAnchors();

  // コードハイライト
  window.addEventListener(eventPagechange, codeHighlight);
  codeHighlight();

  // 記事をシェアするボタン
  window.addEventListener(eventPagechange, share);
  share();

  // Google Analytics
  window.addEventListener(eventPagechange, () => gaTrackPagePath());
});
