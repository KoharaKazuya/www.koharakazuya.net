+++
date = "2018-05-27T12:42:00+09:00"
title = "set(\"a.b\", 10) のようなダサい API をやめるライブラリを書いた"
+++


## tl;dr

- Immutable で Pure Functional なスタイルでネストの深いオブジェクトの一部分を簡単に更新するためのライブラリを作った
- [GitHub](https://github.com/KoharaKazuya/pickpatch)

## 作った経緯

JavaScript のライブラリを眺めていると、オブジェクトのネストの深い一部分を取得/更新するために `obj.set("hoge.fuga", newValue)` のような API に出会うことがある。
(私もその手の API を作ったことがある)

これは文字列として JavaScript オブジェクトキー列を与えることで操作の対象を指定する API だ。
[lodash get](https://lodash.com/docs/4.17.10#get) と言えば伝わりやすいかもしれない。
ここからは便宜上 *キーパス指定形式* と呼ぶ。

キーパス指定形式の API はこうしなければならない or こうしたほうがいい からそうなっているんだろうが、ダサい。
メタプログラミングが表に出ているので、ミスや悪い設計を引き起こす。

どうにかできないか考えてみた。

例えば **全て Immutable という前提** の環境下で更新操作を素直に書いてみよう。

```javascript
const newObj = { ...oldObj, hoge: { ...oldObj.hoge, fuga: newValue } };
```

このようになり、ネストが深いと辛い。

これに対する一つの回答して、メタプログラミングを裏に持ち、素直な API を提供するライブラリが [Immer](https://github.com/mweststrate/immer) だ。

```javascript
const newObj = produce(oldObj, draft => {
  draft.hoge.fuga = newValue;
});
```

このように書ける。
大半の状況で Immer を使えばキーパス指定形式の API は必要ないと思う。

しかし純粋関数型至上主義の過激派にとってこのスタイルは受け入れられない。
(この言い回しは冗談だが、例えば tslint-immutable で再代入を禁止しているプロジェクトではこのスタイルは問題になる)

そこで Immer を参考にし、Immutable で Pure Functional なスタイルでも書けるような API を提供するライブラリを作った。

[GitHub -- KoharaKazuya/pickpatch](https://github.com/KoharaKazuya/pickpatch)

pickpatch を使うとこのようなスタイルで更新操作を書ける。

```javascript
const obj = { a: { b: 1 }, c: 2, d: 3 };
const newObj = pickpatch(
  _ => [_.a.b, _.c], // picker defines partial to update
)(
  ([b, c]) => [b * 10, c + 5], // patcher defines new values
)(
  obj, // old object
);
// -> { a: { b: 10 }, c: 7, d: 3 }
```

更新する対象を指定する picker 関数と更新後の値を定義する patcher 関数を組み合わせて使用する。
ポイントは picker 関数は自由な形でオブジェクトの一部を指定でき、その形で patcher が受け取れるところだ。これによりオブジェクトのどの部分に興味があるか、それらがどう遷移するか、を素直に表現できる。

---

私自身は Immutable で Pure Functional なスタイルに特別なこだわりがないので Immer でいいや、と思うのだがこのような形でも書けるんじゃないか？というアイデアが降ってきたので形にした。
