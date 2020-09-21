---
date: "2017-07-23T21:29:00+09:00"
thumbnail: ./forest_sample-output.png
title: 木構造の整形表示コマンド forest を作った
tags:
  - Rust
---

## これは何か

[forest][github] は行指向で構造化された木構造を表すテキストを整形して出力するコマンド。

```
pattern1_root
pattern1_root/pattern2_last_leaf
root_node
root_node/pattern3_non-last_leaf
root_node/pattern3_non-last_leaf/sample
root_node/pattern3_non-last_leaf/pattern4_non-last_node's_child
root_node/leaf_node
```

上のような入力を

```console
$ cat sample1.txt | forest
├ ─ pattern1_root
│   └ ─ /pattern2_last_leaf
└ ─ root_node
    ├ ─ /pattern3_non-last_leaf
    │   ├ ─ /sample
    │   └ ─ /pattern4_non-last_node's_child
    └ ─ /leaf_node
```

こんな感じに整形して出力するコマンド。

`tree` コマンドのようだが、入力のテキストは `/` 区切りでなくともよい。行が前行に前方一致するなら、ネストする、という単純な整形をする。

こんな感じ。

```
サ
サン
サンプル
forest
forest doesn't specify any characters
forest doesn't specify any characters as separater.
```

```console
$ cat sample2.txt | forest
├ ─ サ
│   └ ─ ン
│       └ ─ プル
└ ─ forest
    └ ─  doesn't specify any characters
        └ ─  as separator.
```

## なぜ作ったか

`find` コマンドの柔軟な検索結果を `tree` コマンドのようなツリー表示で見たいなー、と思ったのがキッカケ。
この問題を解決するツールはあるだろうけど、そもそも整形表示部分だけの単機能にした方がいいんじゃないの、アレ？そういうコマンドないの？と思ったので。

それと Rust の勉強がてら。

## 使い方

パイプでつなげるだけ。オプションなし！

ダウンロードは [GitHub][github] より

Linux と macOS のバイナリをビルドしてます。

## 実装で面白かった点

### アルゴリズム

最初は木構造を整形表示するなんて楽勝じゃね？と思ってたが、以外に難しかった。というのも、`tree` の表示の再現をしようとすると、親ノードが下の兄弟を持つかどうかで行の出力が変わるからだ。

```
├ parent
│ └ child
└ (ここがいるかいないかで child の先頭部分 │ の有無が変わる)
```

```
└ parent
  └ child
```

これがあるため、単純に前から入力を読んでいくだけでは出力を決定できない。(これがあるので、入力を読み終えるまで `forest` は何も出力しない。ノードの深さによっては一部出力可能だが、本質的にはできないので対応していない)

`tree` はファイルシステムへのアクセスの結果なので、ディレクトリエントリを読んだ時点で兄弟の有無が判明するはずなので、**恐らく** この問題は発生しない。`tree` の実装読んでないので予想。

内部で `tree` を全て組み立ててから出力するというのは、避けられないんだけど、読み書きをストリーム状に (= 戻りなく) 処理したいという気持ちがあったのでアルゴリズムを多少工夫した。

アルゴリズムを [README.md][github] に擬似コードで載せてある。手前味噌だがいい感じになっていると思う。もっと言えば、この `forest` の価値はアルゴリズムが全てと言ってもいいんじゃないか？言いたい。

### Rust の言語仕様

私には Rust 難しいです！！！！！

書いてて実感するのが、参照さえ手に入れば書き換えられるというマインドを植え付けられてるなーと。Haskell では感じないからシンタックスの問題なんだろうけど。所有権の考え方は早く慣れたい。どの言語でも役に立つ気しかしない。

木構造を実装しようとしたとき、子と親の両方の参照を埋め込もうとしたら循環参照じゃないか、所有権どうするの！？となって発見があった。
`forest` では妥協で回避している。スマートポインタをちゃんと使いこなせるようにならないと。

`forest` の実装の範囲内だと Rust の特色が全く出ていない。Rust はこわくない、ということ学べた程度だった。

### Rust のビルド

ダイナミックリンクで苦労した。
私は真面目に C/C++ をビルドしたことがないので、`libc` ってなんじゃボケーッって言いながらバイナリ作成を頑張った。

TravisCI 上の Ubuntu がリンクしたバージョンの glibc が CentOS 上のものが古くて実行できないなど。

各ディストリビューション向けに配布ファイルを作るのは面倒くさくて嫌だったので、全て静的リンクするように Rust MUSL ターゲットを使った。

## 終わりに

「forest はこんなところで活用できるよ」と教えてくれると嬉しいです。

[github]: https://github.com/KoharaKazuya/forest
