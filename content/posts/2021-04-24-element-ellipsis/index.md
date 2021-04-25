---
date: "2021-04-24T12:39:00+09:00"
title: "要素版 text-overflow: ellipsis を実装する方法 (省略数の表示付き)"
tags:
  - HTML
  - CSS
  - JavaScript
---

この動画のような動作を実現するための方法を考えたという話です。

https://www.youtube.com/watch?v=jY0zEMXyLXs

CSS では `text-overflow: ellipsis` というテキストが表示エリアから溢れたときに省略記号 (`…`) によって省略表示できます。
これはテキストに対する指定のため、一般の HTML 要素に対しては機能しません。

`display: inline-block` と組み合わせるとテキストを装飾しつつ省略表示できるのですが、今回の場合は省略している要素の数を表示したかったので、CSS だけでは実現できず JavaScript を使用する必要がありそうです。

実装方法のアイデアは

- `display: flex; flex-wrap: wrap; overflow: hidden` で最初の 1 行だけ表示する
- JavaScript で 2 行目以降の要素の数を数え、表示する
- `resize` イベントを監視して動的な変化に対応する

というものです。

詳細は CodePen で確認できます。

https://codepen.io/koharakazuya/pen/poRGzYg

`resize` イベントで直接関係のない window のサイズを監視し、意味的にも負荷的にも適切ではない気がしているのでできれば改良したいですが、私が思い付けたのは上記の実装だけでした。
もっとスマートなやり方があれば教えていただけると助かります。
