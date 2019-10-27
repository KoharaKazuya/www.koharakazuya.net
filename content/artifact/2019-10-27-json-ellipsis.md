+++
date = "2019-10-27T22:52:00+09:00"
title = "Rust で CLI と Web のロジックが共通のツールを作った"
thumbnail = "/images/2019-10-27-json-ellipsis.png"
draft = true
+++

## tl;dr

- 大きな JSON の一部を省略記号に置き換えて、指定サイズ以下に変換するツールを作った
- Rust でコアロジックを書いて、CLI と Web サイトを公開した
- Rust + WebAssembly + Preact + Webpack + Dedicated Worker
- [GitHub](https://github.com/KoharaKazuya/json_ellipsis)

## きっかけ

[Mozilla Hacks](https://hacks.mozilla.org/) を読んでて [WASI の記事](https://hacks.mozilla.org/2019/08/webassembly-interface-types/) など、WebAssembly を使ってみたくなる記事がいくつかあって熱が高まったので。

[WebAssembly 手書きで base122.wasm を作った - Qiita](https://qiita.com/KoharaKazuya/items/593aa8efbf743b20ec28) ということをやったことはあるけど、実用を見据えてアプリケーションを作ったことはなかった。何か実用中心で考えたアプリケーションを Rust から WebAssembly を出力して組んでみたかった。Rust なのは興味があって隙あらば学びたいと思っているため。

## どのようなアプリケーションか？

大きな JSON の一部を `"..."` のような省略記号に置き換えて、全体サイズが指定サイズ以下になるように変換するツール。JSON 中のどの部分を省略記号に置き換えるかは自動判定する。

_before_

```json
{
  "id": 123,
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
}
```

_after_

```json
{
  "id": 123,
  "content": "..."
}
```

共通のコアロジックを呼び出せる Web サイトと CLI を用意した。

- Web: [json-ellipsis](https://koharakazuya.github.io/json_ellipsis/)
- CLI: [Releases · KoharaKazuya/json_ellipsis](https://github.com/KoharaKazuya/json_ellipsis/releases)

Web サイトの方は Dedicated Worker (Web Workers の一つでバックグラウンド処理ができる) を使っている。
巨大な JSON を扱う想定のアプリケーションなので UI をフリーズさせないように。

## 学んだこと

(余談として、wasm-bindgen の練習がてら [PNG Chunk Viewer: PNG ファイルのデータ構造であるチャンクの一覧を表示するウェブサイト。 (wasm-bindgen を試しに使ってみるために作ったもの)](https://github.com/KoharaKazuya/png-chunks-viewer) というのも作っていて個別に記事にしなかったが、そちら感想も以下に含んでいる)

### wasm-bindgen, js-sys, web-sys すごい

マジですごい。

まずガイド ([The `wasm-bindgen` Guide](https://rustwasm.github.io/docs/wasm-bindgen/)) がとても充実している。わかりやすい。
ほぼここと API ドキュメント見てるだけでアプリケーションが作れた。

とにかく手軽になって普通の感覚で JavaScript と Rust の相互呼び出しができる。Web フロント出身としてはいつもの Webpack にちょっとプラグイン入れたら ES Module みたく呼び出せる感覚。
ここらへんの凄さは普通なのが普通なので「実は面倒なことがいかにあるか」を語る必要があるが、そこまで詳しくないので省く。WebAssembly の仕様的に JavaScript とは数値しかやりとりできないので wasm-bindgen が色々やってるとだけ。

js-sys, web-sys がほぼ全ての JavaScript の組み込みオブジェクトやブラウザ API を提供するので Rust から簡単にそれらを使える。
なんなら Web フロントエンドをほぼ 100% Rust で作れる。すごい。
ただ、当然ながら JavaScript 上のデータ型を完全に Rust 上のデータ型に一対一対応させられるわけではないので、区別や変換が必要。そこが面倒なので Rust 100% で組むのは私は選ばなかった。[ここらへんの試み](https://hacks.mozilla.org/2019/08/webassembly-interface-types/) がうまくいって、ブラウザ API を Rust ネイティブな感じで呼び出せるようになったら違うかも。それかフレームワークを勉強したら。

### Webpack + Worker + WebAssembly が難しい

最初は worker-loader 使っていた。
Worker から WebAssembly のモジュールを import すると、Webpack が埋め込むコード中の `window` が Worker コンテキストでは存在せず、クラッシュする。

調べてると Webpack で Worker 読み込むために worker-loader と worker-plugin の二種類あって、worker-loader が公式ぽいけど worker-plugin の方が標準インタフェースに近づけてるっぽくてそっちを採用した。

よくわからんうちに解決した (いろいろいじったけど覚えてない)。

### preact-material-components を入れるとサイズが大きくなる

Web フロントエンドを Preact ベースで作っていて、最低限見た目を整えたくて preact-material-components を入れた。

導入前後で main.js のファイルサイズを測ると 14KB → 120KB となって驚いた。

特に対策していない。

### GitHub Actions をついでに触った

CLI ビルドのために GitHub Actions を初めて使った。
ひょえ〜これが無料か〜とおののきながら触った。

[Rust の Linux/Windows/macOS 向け 64bit バイナリを GitHub Actions で生成する - Qiita](https://qiita.com/dalance/items/66d97c252b8dd9c96c29) を参考にほぼそのままでハマることなくテスト、ビルド、リリースが自動化できた。

その後、Web フロントエンドのデプロイを AWS Amplify Console でやろうとして Rust 周りのビルド環境がうまく整備できず、GitHub Pages で公開することにした。
ここでも GitHub Actions がすんなり使えた。Action を公開してる皆様に感謝。

### Rust 難しい

いつもの。Rust 触るたびに言ってる。
難しい、といつも言うのは不満・不平というわけでなく、何と引き換えにその難しさが必要になってるかは一応わかってるつもり。素晴らしいアイデアでより簡単になってくれれば嬉しいけど。

誰が所有するか、誰が参照するか、それらを区別してデータ構造を設計するように意識した、というかさせられる。私は GC ある言語を主に触るので苦手意識がある。

ジェネリクスをうまく組み合わせて作られたものがエラーを出力したとき、型名がすごいことになる。エラーメッセージが長いので圧倒されずに根性で読む必要がある。根性。
また、トレイトの機能で「型パラメーターが制約を満たしていればこの型も制約を満たす」みたいな動きをするので、型制約のエラーのときに関連する型が制約を満たしているかそれぞれチェックする作業があって頭が混乱しそうになった。

Rust に限ったの話ではないけど、抽象度の高い道具を渡されてもどう組み合わせていいかわからない (私は頭が悪いんだ！) ので、ドキュメントに書かれたサンプルの書き方以外の書き方がさっぱりわからない問題が発生した。
ネット上の記事からコピペしてきてプログラミングとする気持ちがわかった。

---

WebAssembly は将来性すごくいいと思ってるが、一方で面白い使い道が思いつかない。今回のアプリケーションもようやくアイデアが出せたという感じ。
単純に私の「Web でできること」の発想が凝り固まってしまっている可能性が高いが……。
