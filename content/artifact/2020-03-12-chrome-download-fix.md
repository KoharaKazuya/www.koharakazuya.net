+++
date = "2020-03-12T19:29:00+09:00"
title = "Chrome のダウンロードバーを隠すシンプルな拡張を作った"
thumbnail = "/images/2020-03-12-chrome-download-fix.png"
+++

Google Chrome でファイルのダウンロードをしたときに、UI 下部に灰色のバーが出現します。このバー、大きいし自動で消えてくれないので、すごく邪魔に感じていました。

そこでこの問題を _修正_ するために Chrome 拡張を作りました。
(_修正_ という強めの言葉を使ったのは、現状のダウンロード UI は不具合と言っていい、と思えるほど私が不満を持っているからです。)

この拡張がすることは 4 つです。私が考える「Chrome が本来提供すべき UI」を実現できるようにカスタマイズします。そういう意図ですので機能は控えめです。

1. 画面下部のダウンロードバーを隠す
2. 拡張のアイコンをクリックするとダウンロード画面 (`chrome://downloads`) を開く
3. 現在のダウンロード中のアイテムの数をバッヂ表示
4. ダウンロードの開始と完了を通知 (デスクトップ通知) する

[Chrome ウェブストア](https://chrome.google.com/webstore/detail/chrome-download-fix/idbhobikghdkepjgcdiphdbofibbbbfh) からインストールできます。
ソースコードは [GitHub](https://github.com/KoharaKazuya/chrome-download-fix) にあります。
