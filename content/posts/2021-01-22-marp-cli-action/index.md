---
date: "2021-01-22T19:00:00+09:00"
thumbnail: https://marp.app/assets/marp-logo.svg
title: サッと Markdown でスライドを書いて GitHub で自動的に HTML と PDF を公開する方法
tags:
  - Marp
  - GitHub Actions
  - HTML
  - PDF
---

Marp というツールで Markdown から手軽にスライドを作る方法と、そのスライドを GitHub Pages で自動的に公開するためのツール Marp CLI Action というものを作ったので紹介します。

先に結論だけ述べますと、[Marp][] のエコシステムを使ってスライドを書き、GitHub にプッシュすれば [Marp CLI Action][] を含んだ GitHub Actions で GitHub Pages に自動でスライドを公開できます。

## 前置き

会社や勉強会でプレゼンをするとき、どのようにスライドを作成しているでしょうか？
PowerPoint、Keynote、Google スライドなど、さまざまなやり方があると思います。
私はとにかく楽に作りたいので [Marp][] というツールを使っています。

## Marp とは

[Marp][] は Markdown 記法でプレゼンスライドを書けるツールです。およびそのエコシステムのことです。

Markdown 記法からスライドを生成する、というのが中心にあり、そのための Markdown の拡張記法やさまざまなテーマ、CLI や VS Code 拡張などがあります。

雰囲気を掴むために [公式サイト][marp] の example のソースコードを [Marp Web][] に貼り付けてみるとわかりやすいと思います。

## 私のスライドの作り方

私は勉強会で発表する時などは、よく以下の手順でスライドを作成していました。

1. VS Code でプレビューしつつ Markdown を書く
2. VS Code から PDF ファイルを出力する
3. Speaker Deck に PDF ファイルをアップロードする
4. URL を Twitter で公開する

この手順で公開したスライドの例が以下です。

<script async class="speakerdeck-embed" data-id="2f4de29f647b4b84867933ab37e43184" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

<script async class="speakerdeck-embed" data-id="ac90bbe61a4541af8f7068c4081b502d" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

## 改善したいポイント

上記の手順は楽で十分機能していたのですが、スライドを **見る側としては** Speaker Deck に少し不満がありました。

- ハイパーリンクが使えない (スライドがただの画像なので)
- 見てるものはほぼテキストなのに読み込みが重い (私が使っているモバイル回線が非常に細いという特殊な事情があります)

そのような観点から、スライドはなるべく HTML ベースのもので読み込みが軽いものを公開してほしいな、と思いがありました。

また、いつも定型の作業なため可能な限り自動化したいという思いもありました。

## GitHub Actions で自動化する

ソースコードを書くことだけすれば後は公開までを自動化したかったので [GitHub Actions][] を活用することにしました。
また、公開するサイトを [GitHub Pages][] にすることで自分でデプロイ先を用意する必要もなくなります。

Marp の記法で書かれた Markdown から HTML スライドを出力するには、[Marp CLI][] を使えば可能です。
これを GitHub Actions に組み込む必要がありました。

検索すると、ほぼ同じアプローチを用いている人の記事を見つけることができました。
[Markdown でプレゼンを作って GitHub で自動公開するフローを整えた | Cosnomi Blog](https://blog.cosnomi.com/posts/marp-github-actions/)

こちらを参考に、新しく GitHub Action を作成することにしました。上記のものをそのまま使用しなかったのは、私以外の人にも使ってもらいやすくするため、GitHub Action のインターフェースを少し変更したかったためです。

作成した GitHub Action が [Marp CLI Action][] となります。

## Marp CLI Action の使い方

[Marp CLI Action][] の使い方は [README](https://github.com/KoharaKazuya/marp-cli-action/blob/main/README.ja.md) や [サンプルスライド](https://koharakazuya.github.io/marp-cli-action/ja/about-marp-cli-action.html) を参照してください。
こちらのサンプルスライドも Marp CLI Action で生成しています。

[テンプレートリポジトリ](https://github.com/KoharaKazuya/marp-cli-action-gh-pages-template) も用意したので、使用することですぐに使い始めることができます。

## まとめ

[Marp][] と [Marp CLI Action][] を使って、GitHub で手軽にスライドを公開する方法を説明しました。

スライド作りをとにかく楽にしたい、という方にはおすすめの方法です。ぜひやってみてください。

[marp]: https://marp.app/
[marp web]: https://web.marp.app/
[marp cli]: https://github.com/marp-team/marp-cli
[marp cli action]: https://github.com/KoharaKazuya/marp-cli-action
[github actions]: https://docs.github.com/actions
[github pages]: https://docs.github.com/pages
