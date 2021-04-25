import { listen } from "quicklink";
import { gaTrackErrors } from "./google-analytics";
import { share } from "./sns-share";

// エラー情報収集
gaTrackErrors();

// リンクの先読み
if ("IntersectionObserver" in window) listen();

// 記事をシェアするボタン
share();
