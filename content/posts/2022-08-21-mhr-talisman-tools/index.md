---
date: "2022-08-21T15:32:00+09:00"
title: モンハンの録画から護石データをスキャンするサイトを作った
thumbnail: ./mhrsb-logo.jpg
tags:
  - Monster Hunter
  - JavaScript
---

https://www.youtube.com/watch?v=kQ-pvBLURa4

ゲーム、[モンスターハンターライズ](https://www.capcom.co.jp/monsterhunter/rise/) のプレイヤー向けに [護石ツールズ](https://mhr-talisman-tools.koharakazuya.net/) という Web サイトを作りました。サンブレイク対応です。

<https://mhr-talisman-tools.koharakazuya.net/>

Switch キャプチャーボタンによる 30 秒録画機能などを使って護石が表示される瞬間を含めた録画ファイルを与えると、護石のスキルや装飾品スロットなどのデータをスキャンできるサイトです。スキルシミュレーター向けにデータをエクスポートすることもできます。

## 仕組み

動作は (必要アセットのダウンロード除き) ローカルで完結しています。ユーザーデータをアップロード等はしていません。

大まかには、録画データを 1 コマずつ画像として抜き出し、画像の特定座標上の一部と事前に用意したスキル名画像を比較しています。
同じ護石が複数コマにわたって表示され続けることも当然あるので、同じスペックの護石は重複除去しています。

上記のデモ動画を見ていただけるとわかるとおり、スキャン中は録画ファイルを実際にブラウザ上で再生しています。単純に選択・ドロップされたファイルを video 要素に与え、1/30 秒ずつ進める＆画像スキャンを繰り返しています。

画像スキャンではまず護石が表示される画面 (「アイテムＢＯＸ」または「錬金結果」) かどうかチェックしています。これは画面上の特定座標に「装備スキル」という文字があるかどうかで判定しています。護石が表示される画面でなければ関係ない画面なので諸々の処理はスキップできます。

護石が表示される画面では護石のスキルや装飾品スロットなどは特定の位置に表示されるので、画像から特定位置をトリミングします。トリミングした画像と事前に用意した画像を比較します。
全スキルに対してこのような画像を準備しました。

![スキル画像「ひるみ軽減」](https://mhr-talisman-tools.koharakazuya.net/skill/%E3%81%B2%E3%82%8B%E3%81%BF%E8%BB%BD%E6%B8%9B.png)

ゲーム上の画面は UI の背景が半透明だったりするので、事前に用意した画像と完全一致は望めません。そのため比較では可能性のあるすべてのパターンと比較し、類似度が一番高いものを選んでいます。といっても類似の判断には高度なことはしておらず、画素ごとの差を出してその平均が小さいものを選んでます。

---

実はライズ時点で作っていたんですが、面倒くさがって紹介記事を書いてませんでした……。サンブレイクに対応したので改めて書きました。

https://twitter.com/KoharaKazuya/status/1404770837291360264