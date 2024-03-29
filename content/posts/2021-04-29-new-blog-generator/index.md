---
date: "2021-08-15T01:14:00+09:00"
title: このブログの生成ツールを新しく書き直した
tags:
  - Node.js
  - JavaScript
  - Preact
---

[このブログ](https://www.koharakazuya.net/) の記事本文以外の部分は長く [Hugo](https://gohugo.io/) を中心に、自作のカスタムテーマを使って生成されていました。また、生成したファイルを AWS (S3 + CloudFront) にデプロイして Web サイトを提供していました。

Hugo のカスタムテーマだけでは (おそらく) 達成できない細部までこだわりたいという思いから、このブログ専用に Node.js ベースの完全にフルスクラッチで静的サイトジェネレーター (SSG) を作りました。
見た目などは変えていないので、完全に裏側だけの話となります。

同様の課題を持っている人はいるかもしれませんが、私はこの解決方法をオススメしません。Hugo は良くできた SSG ですし、柔軟にカスタマイズしたい場合は [Eleventy](https://www.11ty.dev/) を使うと良いと思います。完全に趣味で SSG を自作しました。

## こだわりたかったこと

このブログの SSG を作った動機でもあるのですが、以下の点について意識しました。

### とにかく速く読み込ませたい

私は他人のブログを読むとき文章を読みたくてページを開きます。なので、本文のテキスト以外は煩わしい要素と感じます。広告、目に付くサイドバー、プッシュ通知許可のステップ、遅い読み込みなどすべて煩わしく感じます。
とくに私は格安 SIM ユーザーなのでスマホからブログを読むとき、**テキストを読みたいだけなのにページを開くのが非常に重い** という経験をよくします。

自分のブログでは読者に本文以外の部分で煩わしい思いをさせたくありませんでした。これは以前からの考えです。

https://twitter.com/KoharaKazuya/status/1242832737704108034

以前から対策済みでしたが、今回も最小限の JavaScript、クリティカル CSS のインライン化、関連ページの先読みなどを組み込み、とにかく速く読み込ませ、読者が煩わしく感じないように工夫しました。

### 控えめな JavaScript にしたい

とにかく速く読み込ませたい、の一部ではあるのですが、[控えめな JavaScript](https://ja.wikipedia.org/wiki/%E6%8E%A7%E3%81%88%E3%82%81%E3%81%AAJavaScript) にしたいと考えました。これも以前から実現していたのですが、最悪 JavaScript がブロックされてもほぼブログとして成り立つ作りにしました。このブログのメインコンテンツは記事の本文です。HTML と CSS だけで成り立つはずです。実際に JavaScript をブロックすると YouTube 動画などの埋め込みコンテンツが動かないので完全に不要というわけにはいきませんが……。

JavaScript は無くてもほぼ問題ないぐらいの機能しか持たせませんでした。必然的に JavaScript の読み込みを待たずに記事の本文が読み始められるので、体感の読み込みは速くなります。

この観点で [Next.js](https://nextjs.org/) などの JavaScript 中心の作りは候補から外れました。Next.js は十分早いのですが、個人のブログのような _しょぼい_ コンテンツに対して React は重すぎでした。

以前までコードのシンタックスハイライトをクライアントで実行していましたが、この観点からブログのビルド時に CSS を埋め込むように変更しました。

### CLS を減らしたい

記事の本文を読んでいる最中にレイアウトのズレが発生すると苛立たしい体験となってしまいます。
[レイアウトのズレは CLS という指標にもなりました](https://developers-jp.googleblog.com/2020/05/web-vitals.html)。

レイアウトのズレをなるべく避けたいところですが、以前の作りでは記事に使用している画像のサイズを埋め込めておらずズレが発生する状態となっていました。画像の幅と高さを取得するのは、Markdown から HTML への変換というような単純な関数とはことなり、ファイルシステムにアクセスする別の種類のタスクとなるため、Hugo のテーマだけでは実現できませんでした。

今回は Node.js ベースのフルスクラッチで書いたので、ファイルシステムへのアクセスも自由にでき、画像の幅と高さを HTML に埋め込んでズレを回避するようにしました。

また、YouTube 動画などの埋め込みコンテンツも読み込み前から幅と高さを与えるようにしてズレを回避するようにしています。

### Markdown でコンテンツを書きたい

直接 HTML を書くより圧倒的に楽なため、記事本文は Markdown で書けるようにしました。

記事に一部メタデータ (タイトルや日付など) を設定する必要があったので YAML Front Matter を使っています。

### 新しいテンプレート記法を覚えたくない

SSG では HTML をパーツ分けして書くためにテンプレートシステムを使うことが多いです。テンプレートエンジンごとの記法が採用されることが多いですが、私は新しい記法を書きたくなかったので JSX を使えるようにしました。

https://twitter.com/KoharaKazuya/status/1264948905004773377

JSX の良い点は私個人が React で慣れている点と JavaScript への埋め込みかつ単純なマッピングという点です。JSX 独自の記法を覚えなくても JavaScript というプログラミング言語の長所を最大限に活かせます。条件分岐を書くために `@if` なのか `if (...)` なのか `{% if %}` なのか迷わなくて済み、`{}` と `<>` が JSX と JavaScript 式の境界ということだけ覚えるだけで済みます。

JSX (Preact) でパーツごとに HTML を書き、組み合わせてページを生成するようにしました。

### いくつかの便利機能が欲しい

その他、いくつかの便利機能が欲しかったので実装しました。

- 記事のタグ付け
- 記事内のヘッダー (h1 〜 h6) の ID 付け＆リンク化
- 記事内のコードのシンタックスハイライト
- Web Share と (Web Share が対応していないデスクトップ環境での) 自前 SNS シェアボタン
- YouTube, Twitter などの埋め込みコンテンツのカスタムリンク
- 関連ページ先読み (Quicklink)
- アナリティクス (Google Analytics)

## 使用技術

使用した技術は以下のようになります。

- ジェネレーター (Markdown の記事ファイルから Web サイトの HTML, CSS, JavaScript を生成する部分)
  - [Node.js](https://nodejs.org/ja/)
  - [unified](https://unifiedjs.com/)
  - [Preact](https://preactjs.com/)
  - [Prism.js](https://prismjs.com/)
  - [sharp](https://sharp.pixelplumbing.com/)
  - [rollup.js](https://rollupjs.org/guide/en/)
  - [TypeScript](https://www.typescriptlang.org/)
- フロントエンド (クライアントサイドで実行される JavaScript 部分)
  - [Quicklink](https://getquick.link/)
  - [webpack](https://webpack.js.org/)
  - [TypeScript](https://www.typescriptlang.org/)
- ホスティング (クラウド部分)
  - [AWS Amplify Console](https://aws.amazon.com/jp/amplify/hosting/)

ジェネレーターは Node.js CLI コマンドとして実装しました。SSG 用のフレームワークを使わなかったのでかなり自由に実装することができました。

テンプレート部分のメインは Preact ですが、Preact らしい機能は使わず、JSX を HTML 文字列に変換する役割です。

rollup.js と CSS Modules ですべての CSS をファイルに抽出しておき、purify-css で不要部分を削ることでクリティカル CSS のインライン化を実装しました。
コードのシンタックスハイライト用の CSS も同様に HTML に埋め込まれています。

コンテンツ部分の Markdown を HTML に変換する部分は unified とその関連ライブラリを使用しています。これにより Markdown の変換プロセスをかなり自由にカスタマイズすることができ、Markdown へ YouTube 動画を楽に埋め込むなどカスタマイズが実現できました。

記事中に画像ファイルがあると sharp で幅と高さを取得し、HTML に埋め込んでいます。また、非常に解像度を落としぼかしたプレースホルダー画像を SVG として HTML に埋め込んでいます。HTML のサイズをそれほど大きくせずに本来の画像がダウンロードされる前のプレビュー表示が実現できます。これは [eleventy-high-performance-blog](https://github.com/google/eleventy-high-performance-blog) の実装を参考にしました。

## 他に採用を検討した技術

最終的に上記のような技術で実装することになりましたが、以下の技術も検討してそれぞれ 8 割ぐらいまで実装してます。それぞれあと一歩のこだわりが実現できなかったので、わざわざ楽な Hugo から乗り換えるコストに見合っておらず見送りました。

- Eleventy + 自作プラグイン
- Deno による CLI コマンドのフルスクラッチ
- Rust による CLI コマンドのフルスクラッチ
- Next.js SSG
- microsite
- Razzle + Preact

---

この記事 2021/04/29 には完成していたんですが、「後で見直して投稿しておこう」と思ってたらすっかり忘れて 3 ヶ月放置してました……。
