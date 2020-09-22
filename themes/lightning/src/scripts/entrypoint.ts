import { contentLoaded } from "document-promises";
import { codeHighlight } from "./codehighlight/codehighlight";
import { headerAnchors } from "./headeranchors/headeranchors";
import { gaTrackErrors } from "./lib/google-analytics";
import { share } from "./share/share";

// エラー情報収集
gaTrackErrors();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}

contentLoaded.then(() => {
  // ヘッダーのリンク化
  headerAnchors();

  // コードハイライト
  codeHighlight();

  // 記事をシェアするボタン
  share();
});
