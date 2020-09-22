---
date: "2020-05-24T12:10:00+09:00"
thumbnail: https://cloud.githubusercontent.com/assets/1911623/26426031/5176c348-40ad-11e7-9f1a-1e2f8840b562.jpeg
title: React のソースコードを読めるようになりたかった
tags:
  - React
  - JavaScript
---

React のソースコードが読めるようになりたく、[Build your own React](https://pomb.us/build-your-own-react/) を参考に頑張ってみたが、難しくて諦めた。その記録。

## 経緯

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">React.lazy ってこういう実装と同じ？ React 側で実装されているのは何か特別なことをやっているから？ ということを調べてるんだけどよくわからない。<br>Created with <a href="https://twitter.com/carbon_app?ref_src=twsrc%5Etfw">@carbon_app</a> <a href="https://t.co/3hfl00wRWO">pic.twitter.com/3hfl00wRWO</a></p>&mdash; 小原　一哉 (@KoharaKazuya) <a href="https://twitter.com/KoharaKazuya/status/1262016799731666944?ref_src=twsrc%5Etfw">May 17, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

React をよく使っていて実装方法に興味が出て「ソースコードを読んでみたいな」と思う瞬間がある。その度に「ちょっと読んでみよう」と覗きにいくが、難しくて読めない (= 理解できない)。

以前に偶然 [Build your own React](https://pomb.us/build-your-own-react/) という記事を見つけた。面白くて一通り読んでみた。
その時は読んでみただけだったが、「この記事ぐらい単純化されているものならわかる、もっと深く理解すれば React のソースコードも読めるようになるでは」と思い、チャレンジした。

## Didact を深く理解する

[Build your own React](https://pomb.us/build-your-own-react/) の記事は Didact という単純化した React のようなライブラリを実装する流れを追う形で構成されている。

この記事は以前に何度か読んだことがあるが、今回はこれを読むだけでなく書き写しながら (いわゆる写経) 理解することにした。

書き写すことで気づけたことがあった。
この Didact というライブラリは (単純化を重要視しているため) 抽象化やモジュール化を無視しているので全体像が非常に理解しづらい。記事を読むだけだと実装の背景や方針が本文中に書かれているので気にならなかったが……。
写経自体は書き写すだけなので復習みたいなものでスムーズに終わった。

Didact をより理解するためソースコードをいじくりまわしてみようと考えた。
抽象化やモジュール化がされていないと感じたので、自分が理解しやすいように分けてみることにしたい。分けることは自分の気の向くままにやったが、そうすることで難しく感じていた Didact の全体像を理解できるようになった。

## Didact の全体像・理解したこと

私が理解した限り、Didact は以下のようなパーツによって動く。

宣言的な性質。これは React でおなじみで、ライブラリ自体のコアコンセプトなので、ライブラリを使う際に理解していることが前提の概念。
欲しいものを書くとそうなるようにライブラリは動作する。

JSX の変換。JSX で書かれたソースコードは Babel などのツールによってピュアな JavaScript に変換される。例えば `<h1 title="foo">Hello</h1>` → `Didact.createElement("h1", { title: "foo" }, "Hello")` など。

createElement によるプレーンなデータ (= Element) への変換。createElement は関数だが、ほとんど中身はなく、ほぼそのままの構造でプレーンなデータに変換している。例えば `Didact.createElement("h1", { title: "foo" }, "Hello")` → `{ type: "h1", props: { title: "foo", children: ["Hello"] } }` など。第 3 引数以降の可変長引数だった children が props 内に格納されていること、テキストノードを扱いやすくするために特別扱いしているのみ。

上記 2 つの動作により、**ソースコードに書いた JSX はライブラリ内で一旦、ほぼそのままの構造のプレーンなデータに変換して扱われる** ということがわかる。

workLoop の動作。
UI が固まることを防ぐため、画面全体の描画の処理は細かく分割され、分割された細かいタスクは workLoop というループによって処理される。**workLoop は UI を固めてしまわない程度になるべく早く処理するように作られている**。Didact では requestIdleCallback を使って、deadline を超えない限り処理を進行させていた。細かいタスクを 1 つ処理するたびに requestIdleCallback でブラウザに制御を戻すと、レイテンシが下がるがスループットが落ちるので、deadline を超えないようにループし続ける。

Fiber とは何か。
workLoop の処理の単位は Fiber (すなわち 1 つの Fiber はこれ以上分割されないし、あらゆる Fiber 間には割り込まれる可能性がある)。**Fiber は 1 つの Element に対して 1 つ作られる**。なので Element ツリーに対応した Fiber ツリーが作られる。Fiber ツリーは workLoop の中で徐々に構築されていく。**1 つの画面描画に対し 1 つの Fiber ツリーが構築される**。
**Fiber は処理の単位となるためのデータ構造** なので、処理をしやすくするためのデータを持っている。すなわち、Element のデータ、Fiber ツリーの走査を楽にするための他 Fiber への参照、前回の Fiber への参照、変化種別 (新規 or 更新 or 削除) など。

render phase と commit phase とは何か。
なるべく画面が固まる時間を減らしたい。その一方で中途半端な DOM 状態を表示する訳にはいかないので DOM 操作は一気に終わらせる必要がある。そのため、画面描画・更新の処理を render phase と commit phase に分ける。commit phase では一気に DOM 操作を完了させる (= その間 UI が固まる)。
commit phase の時間を最小にするため、実際の DOM 操作以外の処理である、ユーザー定義の関数コンポーネントの実行や新規 HTML Node の生成 (これは画面上の Document ツリーから辿れないので画面には表示されない、裏で作っておける) や変化種別 (新規 or 更新 or 削除) の判定などを事前に終わらせておく。これが render phase。
**render phase と commit phase でダブルバッファリングみたいなことをしている**。

Reconciliation とは何か。
Didact が宣言的なライブラリである以上、ユーザー定義のプログラムから得られる情報は「次の UI はこうあるべきだ」という情報 (= Element ツリー) であり、変化した部分の操作の情報というわけではない。
経験的に、UI の変化のほとんどはその一部だけなので全て更新する必要はないことがわかっている。また、更新がなかった部分の DOM を操作してしまうと、Element に表れない DOM のステート (input のカーソル位置など) を破棄してしまう。なので更新があった部分の DOM の操作だけをするように、**前回の Fiber ツリーと今回の Fiber ツリーを比較することで、変化種別 (新規 or 更新 or 削除) を判定する**。
新規では HTML Node を生成し、更新では HTML Attribute の書き換えをし、削除は HTML Node を削除する。HTML Node の種類の変化 (例: `<h1>Hello</h1>` → `<div>Hello</div>`) は 新規 かつ 削除 として判定する。
この比較は Fiber/Element の type によって行われる。つまり、h1 や div といった部分が比較され、props, attribute 部分は関係ない。関数コンポーネントの場合は純粋に関数オブジェクトの比較による。

Hooks の動作 (useState のみ)。
Fiber にデータの保存場所を用意しておき、呼び出し順序に依存した保存場所を参照、更新しつつ動作する。グローバル変数を利用し、前回の Fiber のデータも利用するので、変わったインターフェースを持っているが、データを保存・復元しているだけで実装もシンプル。

これらを Didact によって理解した。Didact は大部分が React と共通の用語、概念を使っているので、これで React の内部実装が理解しやすくなったはず。

## React のソースコードを読む

再び、React のソースコードを読んでみようとした。
`packages/` 以下の `react`, `react-reconciler`, `react-dom` を中心にいくつかの疑問点を解決できないか読んでみた。

- 各パッケージを分ける方法と全体像
- Didact の workLoop は常時起動しているが、React は更新の間はループ止めるようになっているか？
- Didact は過去の Fiber へ参照を持つのでチェーンして昔の Fiber が GC で回収されなさそうだが対策されているか？
- Suspense と lazy の実現方法は？

やはりわからなかった。
Update Queue という知らない概念が出てきた。

---

この記事としては尻切れトンボ感があるが、実際 Didact の理解までは気分良く進められたいたのに React のソースコード読み始めると難しくて一気に萎えたので書くことがない。

まあ、Didact 相当のものなら一から作れる程度には理解できたことはよかった。
