+++
date = "2020-06-21T10:15:00+09:00"
title = "Factorio でバッテリー式機関車の MOD を作った"
thumbnail = "https://raw.githubusercontent.com/KoharaKazuya/BatteryLocomotive/master/thumbnail.png"
+++

そこそこ前から [Factorio](https://factorio.com/) というゲームにハマっている。

<iframe width="560" height="315" src="https://www.youtube.com/embed/DR01YdFtWFI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

このゲームの追加コンテンツを作り、公開した。

## 作ったもの

[Battery Locomotive](https://mods.factorio.com/mod/BatteryLocomotive) というバッテリー式機関車を追加する MOD ([日本語での説明](https://github.com/KoharaKazuya/BatteryLocomotive/blob/master/README.ja.md))。

![プレイ画面のショートムービー](https://user-images.githubusercontent.com/1829589/84572307-12e6a980-add4-11ea-93c2-65bf5f600ba2.gif)

詳しい内容や作ったモチベーションなどはリンク先に書いている。

## 作り方

公式で MOD の基盤が用意されている (すごい)。

MOD の作り方・チュートリアルは [Factorio 公式 Wiki の Modding ページ](https://wiki.factorio.com/Modding) に詳しく書かれており、わかりやすい内容となっている。
オシャレな感じのドキュメントではないが、テキストの内容は一流のドキュメントだいう風に感じた。

Lua というプログラミング言語を使って MOD を書く。Factorio 用の API が公開されている。

MOD はただの 1 つのディレクトリ、またはそれを ZIP 化したものであり、特定のディレクトリに配置するだけで作れる。
ディレクトリ内に特定のファイル名で配置すると Factorio によって読み込まれる。

完成した MOD は [Factorio MOD Portal](https://mods.factorio.com/) にアップロードすることで公開できる。
公開した MOD はゲーム内の MOD メニューからインストールできる。

## 作った感想

実のところ「Factorio の MOD を作るか〜」という感じで、MOD を作ること自体を目的に始めたので、何を作るかという部分で割といろいろ考えた。
Factorio というゲーム、それ自体がよくできていて足りないとか変えたい部分が無さすぎる。
MOD のアイデアは 4 つほど出したがそのうち 3 つはボツになった。

公式・コミュニティーのサポートが手厚くてかなり簡単に作れた。
昔 Minecraft で MOD を作っていたことがあったが、あちらに比べると公式が MOD サポートしているというのはやはり大きい。Minecraft の方も Forge のおかげでかなり楽になったが……。

ドキュメントとして [チュートリアル](https://wiki.factorio.com/Tutorial:Modding_tutorial/Gangsir)、[MOD 構成](https://wiki.factorio.com/Tutorial:Mod_structure)、[Lua API](https://lua-api.factorio.com/latest/)、[プロトタイプデータ](https://wiki.factorio.com/Prototype_definitions) あたりを押さえておけばほぼどんなものでも作れる気がする。

Lua というプログラミング言語は慣れておらず若干戸惑う部分もあるが、すぐに慣れた。
割と素直だと思う。リストの扱いがちょっと変わっているが。

Lua は速いらしいが、スクリプト言語側で 60 fps で呼び出される処理を書くのは抵抗感があった。16 ms といえば結構長いが、当然全部使っていいわけもなく速い方がいい。
自分が MOD で遊んでる感じ特別重いという気はしなかったので、まあ問題ないのだろう。

VS Code でデバッグ環境を整えると楽。[これ](https://marketplace.visualstudio.com/items?itemName=justarandomgeek.factoriomod-debug) 作った人凄い。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">VSCode で Factorio Modding が開発できる。すんごい。<br>ブレークポイントでちゃんとゲームが停止する。<br>詳しくは fff-337 <a href="https://twitter.com/hashtag/factorio?src=hash&amp;ref_src=twsrc%5Etfw">#factorio</a> <a href="https://t.co/9jDMuqxJXK">pic.twitter.com/9jDMuqxJXK</a></p>&mdash; 小原　一哉 (@KoharaKazuya) <a href="https://twitter.com/KoharaKazuya/status/1270676088503451648?ref_src=twsrc%5Etfw">June 10, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

ゲーム内のデバッグメニュー (F5) とか Prototype Explorer (Ctrl+Shift+E) とか活用すると便利。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">公式にもこういうデバッグ用ツールが組み込まれてて快適。<br>詳しくは fff-349 <a href="https://twitter.com/hashtag/factorio?src=hash&amp;ref_src=twsrc%5Etfw">#factorio</a> <a href="https://t.co/OdjfRtvzuk">pic.twitter.com/OdjfRtvzuk</a></p>&mdash; 小原　一哉 (@KoharaKazuya) <a href="https://twitter.com/KoharaKazuya/status/1270676801325391873?ref_src=twsrc%5Etfw">June 10, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

英語を書くのがちょっと億劫だった。通じてるんだか通じてないんだかわからない。
でも流石に MOD Portal で公開するなら英語にしておかなきゃな、と思って書いた。

MOD の内容としては、機能はシンプルで、わかりやすく、Factorio 自体に馴染んだ感じのものができたので満足している。
