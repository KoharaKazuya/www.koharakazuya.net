---
date: "2018-09-10T23:52:00+09:00"
title: Go でシンプルな DI コンテナのライブラリを書いた
tags:
  - Go
---

## tl;dr

- Go でシンプルな DI コンテナのライブラリを書いた
  - Dependency Injection の中でも Constructor Injection のみ
  - [go.uber.org/dig][dig] がどうしても受け入れられないミニマリスト向け
- [github.com/KoharaKazuya/conigo][conigo]

## Conigo の紹介

Conigo は Constructor Injection の実現をサポートするための DI コンテナを提供するライブラリ。インターフェースは [go.uber.go/dig][dig] に酷似していて、機能的にはほぼサブセット。

特徴は非常にシンプルであるということ。実装が 200 行程度、10 KB 未満しかなく、API が実質的に `Provide` と `Resolve` しかない。依存パッケージも `fmt` と `reflect` のみ。

Conigo は `reflect` を使っているため、煩わしさ感じずにコーディングできるわりには専用ツールによるプログラム生成などの通常のワークフローを壊すような仕組みは導入しなくて良い。

使い方は [GoDoc][] の Example を見てもらえれば割とすぐに分かると思う。
(自分の英語が伝わる気がしないので Example をいっぱい書いたつもり)

## 作った経緯

業務で Go を書くことになった。
HTTP サーバーを書くにあたり、サービスの生成の知識を分離するため DI パターンでコードを書いていた。以下のような感じのコードを書いていた。

```go
package hoge

type HogeImpl struct {
  ...
}

func New(fuga FugaServiceInterface) *HogeImpl {
  return &Hoge{fuga}
}

func (h *HogeImpl) Say() string {
  return h.fuga.String()
}
```

```go
package di

var (
  hogeSrv HogeServiceInterface
  ...
)

func InjectHoge() HogeServiceInterface {
  if hogeSrv == nil {
    hogeSrv = hoge.New(InjectFuga())
  }
  return hogeSrv
}

func InjectFuga() FugaServiceInterface {
  ...
}
```

愚直に Constructor Injection を手で書いていた。`InjectXXXX` が数多くできる感じ。似たようなコードを量産しないといけない煩わしさがあったが、サービスのインターフェースとサービスの実体を生成する泥臭い知識を分離できるので我慢していた。

が、いろいろ調べていると [github.com/facebookgo/inject][inject] やら [go.uber.go/dig][dig] などがスマートに DI を実現していて使いたくなった。ちなみに他の DI ツールも一応見てみたが、専用ツールで設定ファイルからコードを生成するものはどうしても受け入れられなかったので選択肢から外した。

それまで書いていたコードが Field Injection ではなく Constructor Injection で、今後も Field Injection を積極的に使うことはなさそうなので、[github.com/facebookgo/inject][inject] は一旦置いておき [go.uber.go/dig][dig] を導入しようと検討した。

dig の API を読んでいると、最も基本的な API でユースケースの大半をカバーできる気がしてきたので、自分で書いてみようと思い立った。また、ちょうど `reflect` 周りを触ってみたいと思っていたところだったのでタイミングが良かった。

経緯はそんな感じ。

## 作ってみた感想

Go の統合された便利さが素晴らしい。
godoc.org 良い。特に何も指示しなくても GitHub にコードを公開するだけでドキュメントが見れるようになる。
Testable Examples も良い。どの言語にもほしい。

Go の type と underlying type の関係が面白い。実行時の値の運用に互換性があるんだけど、型情報は定義したものがしっかり取れる。これのおかげで DI のために別名をサクッとつける、みたいなことができる。フワッとしか理解してないんだけど。

少ない実装量で「いい感じに」やってくれるものを作れて嬉しい。

自分で使ってバグを踏んでエラーメッセージが難しくて困ったので、メタプロ中心のライブラリはいかにエラー周りを難しないかに力入れたほうがいい気がした。言語開発者がつけてくれている補助輪を外すということなので。

---

作った愛着はあるから私は使うが、ミニマルだという点以外で dig に対して有利なところは発見してない。今後も、同様のものがほしい人にはまずは dig を勧めると思う。

Conigo はライブラリは全部読まないと信用できない、って人には刺さるんじゃないの (適当)

[conigo]: https://github.com/KoharaKazuya/conigo
[godoc]: https://godoc.org/github.com/KoharaKazuya/conigo
[dig]: https://github.com/uber-go/dig
[inject]: https://github.com/facebookgo/inject
