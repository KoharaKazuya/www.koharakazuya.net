---
date: "2022-11-24T23:10:00+09:00"
title: React useEffect で何が原因で更新されたのか調べるスニペット
tags:
  - React
---

React ユーザーのみなさま、`useEffect` を使っていて「想定外に副作用の関数 (第一引数) が実行されてしまった、でも依存 (第二引数) のどれが原因かわからない」ということはありませんか？

私はたまにあるので以下のスニペットを使っています。類似の問題でお困りの方はご利用ください。

```typescript
import { useEffect, useRef } from "react";

type R = Record<string, unknown>;

function useWhyDidYouUpdate(name: string, props: R) {
  const previousProps = useRef<R>();
  useEffect(() => {
    const prev = previousProps.current ?? ({} as R);
    const allKeys = Object.keys({ ...prev, ...props });
    const changesObj = {} as R;
    for (const key of allKeys)
      if (prev[key] !== props[key])
        changesObj[key] = { from: prev[key], to: props[key] };
    if (Object.keys(changesObj).length)
      console.log("[why-did-you-update]", name, changesObj);
    previousProps.current = props;
  });
}
```

[元ネタ](https://usehooks.com/useWhyDidYouUpdate/) があります。元ネタからいくつかの変更点があります。

## 使い方

使い方としては、まず上記をコピーし確認したい `useEffect` のあるファイルの末尾などに貼り付けます。次に `useEffect` のすぐ下に `useWhyDidYouUpdate("<わかりやすい名前>", { ... });` という記述を追加します。ここで `...` は `useEffect(fn, [ ... ])` の `...` 部分を丸々コピペしたものを使います。

たとえば、

```typescript
useEffect(() => {
  // ...
}, [a, b, c]);
```

のようになっている場合は `a, b, c` の部分をコピペして

```diff
 useEffect(() => {
   // ...
 }, [a, b, c]);
+useWhyDidYouUpdate("更新処理", { a, b, c });
```

のようにします。

その後、「想定外に副作用の関数が実行されてしまう」状況を再現すればブラウザの開発者コンソールに、依存のうちどの部分に変更があったかが表示されます。

## 類似のソリューション

- [useWhyDidYouUpdate React Hook - useHooks](https://usehooks.com/useWhyDidYouUpdate/)
- [use-what-changed](https://github.com/simbathesailor/use-what-changed)

このスニペットを作ったのは、一時的な調査のためにライブラリをインストールするのは手間であることと、手軽にコピペするために余計な部分を削ぎ落としたかったからです。

## JavaScript 版

私は普段 TypeScript をメインに使っているので TypeScript として書いていますが、JavaScript 版も置いておきます (型定義を外しただけ)。

```javascript
import { useEffect, useRef } from "react";

function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef();
  useEffect(() => {
    const prev = previousProps.current ?? {};
    const allKeys = Object.keys({ ...prev, ...props });
    const changesObj = {};
    for (const key of allKeys)
      if (prev[key] !== props[key])
        changesObj[key] = { from: prev[key], to: props[key] };
    if (Object.keys(changesObj).length)
      console.log("[why-did-you-update]", name, changesObj);
    previousProps.current = props;
  });
}
```

---

そもそも実行されて困るような処理を `useEffect` に書くな、わからなくなるほど複雑にするな、という意見は……ぐうの音も出ません。正論パンチやめて。
