---
date: "2018-11-25T17:00:00+09:00"
title: 非同期処理を挟んで CPU 使用率を抑える JS ライブラリを作った
tags:
  - JavaScript
---

## tl;dr

- [coolit.js][github] を作った
- 非同期を挟んで CPU 使用率を抑える npm パッケージ
- 元ネタは [chillout.js][]
- 戦略を選んで Iterator を AsyncIterator に変換する
- 小さなライブラリ (非圧縮状態で 3.3 KB の 1 ファイルのみ)

## coolit.js の紹介

重たい処理を JavaScript で書くときに同期的にメインスレッドで動かすと UI が固まってしまうため、適宜 _休憩_ をはさみつつ実行させることで UI が固まってしまうことを防ぐのをサポートする。

```js
(async () => {
  let sum = 0;
  for await (const i of coolit([1, 2, 3, 4, 5])) {
    // heavy task
    sum += i;
  }
  console.assert(sum === 15);
})();
```

```js
(async () => {
  let sum = 0;
  function* heavyTask() {
    for (const i of [1, 2, 3, 4, 5]) {
      yield;
      // heavy task
      sum += i;
    }
  }
  for await (const _ of coolit(heavyTask())) {
  }
  console.assert(sum === 15);
})();
```

coolit.js を使うとこんな感じのコードになる。
自分で試してみたい方は以下で。

<p data-height="265" data-theme-id="0" data-slug-hash="rQvEvd" data-default-tab="js,result" data-user="koharakazuya" data-pen-title="coolit.js demo" class="codepen">See the Pen <a href="https://codepen.io/koharakazuya/pen/rQvEvd/">coolit.js demo</a> by KoharaKazuya (<a href="https://codepen.io/koharakazuya">@koharakazuya</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

詳細は [GitHub][] を参照。

ただ、重い処理の対策は素直に Worker (別スレッド) に逃がすことを始めに検討するのが良い。

## 作った動機と工夫点

[chillout.js][] を GitHub で見かけて、そういえば `requestAnimationFrame` だったり `setImmediate` を使ってループを書くことはたまにあるけどライブラリ使ったことないな、と気付いた。
chillout の API を眺めてると自分なら Async Iterators 使うなーと思ったので作った。

ES2018 の `for-await-of` 構文で扱えるようにした後に、Edge などまだ動かない環境もあるのでそれを必須にするには時期尚早だろうと思い直して無くても動くように修正した。もちろん `for-await-of` が使える環境なら使って書ける。
`Symbol.asyncIterator` が無い環境では `AsyncIterableIterator` ではなく単に `Iterator` となるようにした。

ES2017 Async Functions の環境を前提としているが、これは 2018/11 現在のモダンブラウザなら使える。
IE 11 などは……トランスパイルとポリフィルがあれば多分動く。試してないけど。

また、処理進行の戦略は選べたほうがいいだろうと思い、オプションで選べるようにしている。
`requestAnimationFrame` や時間指定などを選べるようにした。デフォルトは `requestIdleCallback`。

今回初めて `rollup` を使った。
これにより npm 配布を UMD 形式と ESM (mjs) 形式を両立させた。今まであまり理解していなかったが、ようやく学べた。

---

こんな小さな量でも TypeScript で書くとサポートを受けられるし、実際助かったシーンがあったんだけど、TypeScript 使うだけでもすぐにビルドやテストなどのツールチェーン周りが複雑になっていくからしんどい。EcmaScript だけだったらすごく簡単に終わるので。

[github]: https://github.com/KoharaKazuya/coolit
[npm]: https://www.npmjs.com/package/coolit
[chillout.js]: https://github.com/polygonplanet/chillout
