---
date: "2023-05-26T21:41:00+09:00"
title: Browserslist のクエリには罠がある
tags:
  - Browserslist
---

Web フロントエンド開発でよく使われる [Browserslist](https://browsersl.ist/) では、`last 2 Chrome versions, iOS >= 13.2` のようなクエリを使って対象の実行環境を指定します。この書き方は一見簡単に見えますが

- `and` は優先して結合したりしない
- `not` は単項演算子ではない

というルールがあり、「普通のプログラミングの感じと一緒でしょ」と思っているとハマりやすいので注意が必要です。

## `,` と `or`

[`,` は `or` と同等です](https://github.com/browserslist/browserslist/blob/5c06f83c676c8a549e412ae5e9611e1feba854f6/README.md?plain=1#L206-L207)。これは自然と受け入れられると思います。

## `and` は優先して結合したりしない

[`and` は左に書いたすべての条件と「かつ」で結合します](https://github.com/browserslist/browserslist/blob/5c06f83c676c8a549e412ae5e9611e1feba854f6/README.md?plain=1#L209-L212)。`last 1 version or chrome > 75 and > 1%` が (`browser last version` または `Chrome since 76`) かつ `more than 1% marketshare` のように解釈されます。

JavaScript のような演算子の優先順位があるプログラミング言語のように考えていると `A || B && C` は `A || (B && C)` のように考えてしまいますが、それとは異なります。

## `not` は単項演算子ではない

`not` は右に書いた条件の逆を指定するものですが、同時に [`not` の左に書いた演算子を強制的に `and` と解釈します](https://github.com/browserslist/browserslist/blob/5c06f83c676c8a549e412ae5e9611e1feba854f6/README.md?plain=1#L218-L219)。つまり、以下の 3 つが同じ条件と解釈されます。

- `> .5% and not last 2 versions`
- `> .5% or not last 2 versions`
- `> .5%, not last 2 versions`

逆の条件を生み出すだけだと思いきや、左に書いた条件にも影響してしまうためかなり意外です。

## 例

上記の説明から、`> 0.5%, last 2 versions, Firefox ESR, not dead` のクエリにおいて `not dead` によってシェアが 0.5% を超えていてもサポートが切れているものは含まれないようになっている、と指定されていることがわかります。そして末尾に `, ie 11` と付け加えることと先頭に付け加えることの結果は異なるということもわかります。

実際に試してみたい方は <https://browsersl.ist/> でクエリを入力してみて結果の一覧を確認してみてください。
