---
date: "2016-09-19T19:58:00+09:00"
thumbnail: https://raw.githubusercontent.com/KoharaKazuya/md2img/f3239ac8fd6ccd583e049211c14ab160218e2696/readme_assets/usage-sample.gif
title: Node パッケージ md2img を作った
tags:
  - JavaScript
---

[Node パッケージ md2img](https://www.npmjs.com/package/md2img)

## これは何か

コマンドラインで使える Markdown ファイルを HTML レンダリングし、
画像 (PNG) のバイナリデータとして標準出力に流せるツール。

↓ iTerm2 3.0 のインライン画像表示機能と組み合わせて利用している例を見てほしい。

![使い方一例](https://raw.githubusercontent.com/KoharaKazuya/md2img/f3239ac8fd6ccd583e049211c14ab160218e2696/readme_assets/usage-sample.gif)

レンダリングは GitHub 上の見た目と同じに目指している。

## なぜ作ったか

Markdown ファイルのリアルタイムプレビューができるエディタ、
WYSWIG エディタなど、プレビュー方法はいくらでもあるんだけど、
意外にプレビューしながら書くことは少ない。

ただ、コミット直前には確認しておきたいなー、と思うことがあるので
わざわざそのためだけに Markdown エディタを開くのもちょっと……って思ったので。

## 技術的に面白かったところ

[PhantomJS](http://phantomjs.org/) とその node 用アダプタ [phantomjs-node](https://github.com/amir20/phantomjs-node) を触れた。

コンテンツ書き換えからアセットロード完了 (Markdown 内の画像ダウンロード) まで
待機する必要性を理解しておらず、ちょっと詰まった。
結局 PhantomJS のデバッグ方法を確立しなかったのが心残り。
(PhantomJS の node-inspector 風のサーバーへはアクセスできたが、
node-phantom だとちょっとよくわからなかった)

今までよくわかっていなかった node-gyp が何かなども調べてなんとなく理解。

GFM + GitHub の CSS に一致するように作りたかったので、Atom [Markdown Preview](https://atom.io/packages/markdown-preview)
パッケージを参考にした。

npm にパッケージ登録するのは初めて。
利用例のアニメーション gif を git 管理に入れちゃって、ダウンロードが
超重くなる落とし穴を以前に Atom パッケージ公開 ([tree-view-background](https://atom.io/packages/tree-view-background))
のときに踏み抜いてたので、今回は気をつけた。
.npmignore に追加するだけなんだけど。
