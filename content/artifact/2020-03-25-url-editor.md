+++
date = "2020-03-25T20:00:00+09:00"
title = "グラフィカルに URL を編集できるサービスを作った"
thumbnail = "/images/2020-03-25-url-editor.png"
+++

[![demo-video](https://user-images.githubusercontent.com/1829589/77241986-26530000-6c3d-11ea-957c-782a28747034.gif)][url-editor]

リンク: [https://url-editor.koharakazuya.net/][url-editor] (ソースコード: [GitHub][github])

## どのようなサービスか

URL の編集ができる Web サービスです。
URL は全体の文字列を直接編集することもできますし、クエリ文字列の一部をエスケープ処理を自動でしながら編集することもできます。

URL の一部をハイライトしながら表示するので「URL の scheme 部分ってなんのこと？」といった初学者が URL を学ぶのに使うのも良いかもしれません。

PWA ですので、オフラインで利用可能 & ローカルにインストール可能です。モダンブラウザなら動きます (Edge については最新の Chromium ベースのものだけ)。

---

ここから以降、技術的な話。

## 動機

特に動機はないかもしれない。
強いて言うと、きっかけが Service Worker の更新処理に興味があって調べてるときに PWA のローカルインストールのユースケースがメリットになりそうなアプリがあったら試してみたいと思ったので、逆算してこれが面白そうだと考えたので。

## ツール

Preact, Preact CLI, TypeScript, uri-js, Cypress, AWS Amplify Console など。

### contenteditable 周りの工夫

結構特徴的だと思うのは、URL の入力部分がリアルタイムにハイライトする機能 (小さな WYSIWYG 相当) があって、それを実現するために contenteditable 属性の HTML 要素を使っているんだけど、その部分の HTML も Preact で書きたかったので preact-render-to-string と innerHTML への代入を使っているところ。

innerHTML で DOM を更新するたびにキャレット (入力位置を示すカーソル) が に吹き飛ぶ。それだと入力しづらいので、自前コードで位置を復元している。

IME での変換中 (特に Android だと英字の入力でも予測変換のために IME 入力になる) に innerHTML で更新すると、変換が自動確定されてしまうので、変換中は更新しないように調整した。
そのときはこの記事が役に立った: [IME（全角）入力における js イベント現状調査 - Qiita](https://qiita.com/darai0512/items/fac4f166c23bf2075deb)。すごく助かった……。

### Preact CLI prerender 機能の罠

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Preact が Cypress 環境で属性の適用だけできなくなる。&lt;div&gt;text&lt;/div&gt; みたいな要素とテキストだけの HTML が生成される。なんだこれ</p>&mdash; 小原　一哉 (@KoharaKazuya) <a href="https://twitter.com/KoharaKazuya/status/1240932037906690048?ref_src=twsrc%5Etfw">March 20, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

補足: Preact CLI prerender 機能の影響。Cypress は関係ない。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">hydrate を理解してなかっただけだった。<br>クラサバのレンダリングで不一致が起きたとき、属性以外だけ更新するらしい</p>&mdash; 小原　一哉 (@KoharaKazuya) <a href="https://twitter.com/KoharaKazuya/status/1240949358310215680?ref_src=twsrc%5Etfw">March 20, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">読んだ。まさにコレだった。<br><br>“The Perils of Rehydration”, a tutorial from Josh Comeau. <a href="https://t.co/YOSbg9itsH">https://t.co/YOSbg9itsH</a> <a href="https://twitter.com/JoshWComeau?ref_src=twsrc%5Etfw">@JoshWComeau</a>より</p>&mdash; 小原　一哉 (@KoharaKazuya) <a href="https://twitter.com/KoharaKazuya/status/1240959240560193538?ref_src=twsrc%5Etfw">March 20, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">We&#39;re working on some changes in Preact that will reduce the cases where missing attributes can occur.</p>&mdash; Jason Miller 🦊⚛ (@_developit) <a href="https://twitter.com/_developit/status/1241099280376569858?ref_src=twsrc%5Etfw">March 20, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Jason Miller さん (Preact の作者) からリプもらって、この罠にハマらないように改善予定だ、ということを教えてもらった。
(私は日本語のツイートしかしてないんだけど、よくエゴサで見つけられるもんなんだなぁ)

### アイコンフォントのサイズ問題

最初は Font Awesome で行こうかと思って開発していたんだけど、全部のアイコン使うわけではないので全部のフォントデータをダウンロードしてくるのは非効率。なのでサブセット化しようとかと思ったが、とてもハードだった。
Icomoon に変更して 1 文字ずつ対応した。

### ダークモード対応

ダークモード対応した。一応。

特に困ったことは起きなかった。

### Reset/Normalize CSS の選考

nomalize.css (Necolas), normalize.css (CSS Tools), sanitize.css, css remedy, modern-css-reset のソースコードを読んで sanitize.css を選んだ。
決め手は Create React App で採用されている postcss-normalize で使えるということ、`box-sizing: border-box;`, `word-break: break-all;`, `line-height: 1.5;` などの opinionated なところが自分と一致していたところ。

今後もしばらくは sanitize.css を使おうと思う。

### Cypress を初めて使ってみて

とにかくセットアップ周りが楽なのが好印象。
テスト周りは実現したいコアアイデアからずいぶん離れたところなので、どうしてもモチベーションが低い。そのため楽なのはとても良い。

仕組み的に隠蔽せずにフルアクセスを許しつつ、基本は読みやすく使いやすい DSL を使わせる、という方針は素晴らしい。DSL を覚えさせられるのはちょっとストレスだけど。
DSL のデフォルトのアサーションや非同期処理をリトライしながら待つ、という設計思想がとても優れているように思えた。

ただ、URL Editor のテストはそんなに多くないはずなんだけど、確率的に失敗する現象に遭遇した。type 操作が固まって 1 文字も入力されないままタイムアウトする。
contenteditable を使っているせいかも。

### クロスブラウザ対応

シェアが高くてモダンなブラウザと言えるブラウザには対応した。
[Chrome, Firefox, Safari, Edge の最新 2 バージョン (モバイル含む)](https://github.com/KoharaKazuya/url-editor/blob/d3f53c560496461ba8b4bd18b9ad5721fa75309a/package.json#L6-L11)。

モダンブラウザ対象なので IE では動かない機能もバンバン使ってる。

タイミング的に Edge が面白いことになっていて、最新の Edge (Chromium ベース) は Windows Update で配信が日本では保留されている。確定申告への影響を配慮してらしい。
昔の Edge では動かないので、最新の Edge (アイコンの色に緑を含むように変わった) にアップグレードしてほしい。

## 雑感

今回は割と丁寧に作り込んだ。私は GUI 部分を触るのが好きなので楽しくなって。

サービスのアイデア自体は平凡なものだけど、Web サービスで手軽に使えてインストールしてオフラインでも使える、という性質はマッチしているのではないかと。
こういうサービス増えてほしい。たまにしかしない作業周りは特に。動画 → GIF 変換とか Windows 向け ZIP 作成とか SVG → PNG 変換とか。

[url-editor]: https://url-editor.koharakazuya.net/
[github]: https://github.com/KoharaKazuya/url-editor
