---
date: "2019-02-10T14:21:00+09:00"
thumbnail: ./cocore_color-wheel.svg
title: RGB ↔ HSL などの色表現を変換するツールを作った
tags:
  - Rust
---

## tl;dr

- [cocore][github] を作った
  - RGB ↔ HSL などの色表現を変換する CLI ツール

## cocore の紹介

[cocore][github] を作った。

RGB, HSL, Hex 形式の色表現を CLI で相互変換するコマンド。

RGB `rgb(255, 0, 0)` ↔ HSL `hsl(0, 100%, 50%)` ↔ Hex `#F00`
といった感じで CSS 形式の表現を変換できる。

使用例

```console
$ cocore --to=rgb '#f00'
rgb(255, 0, 0)
$ echo 'hsl(0, 100%, 50%)' | cocore
#F00
```

## なぜ作ったか

GUI が必要なツールなどを作るとき、配色を決める際に HSL で色相かトーンを固定しつつ色を量産することが多い。
その際に HSL 形式で直接指定できれば楽だが、RGB 形式または Hex 形式でしか受け付けていないことがままある。
変換するツールはインターネットにいくらでもあるが手元でサッとやりたかったのと、ジェネレーターなどのスクリプトに組み込みたかったので。

## 使い方

バイナリファイルを実行可能にしてパスを通すだけ。
macOS ユーザーは Homebrew でインストールできる。

インストール後、ヘルプ表示。

```console
$ cocore -h
```

詳細は [GitHub][] の README で。

## 使ったツールの感想

Rust で作った。Rust 2018 Edition を試したかったので。
といってもモジュール周りが楽になった！ぐらいの使い方しかしてない。

Rust の Linter として [Clippy][] を使った。
元々 VSCode の Rust (rls) 拡張に組み込まれているようで、オプションで有効にするか `#![warn(clippy)]` を指定することで、リアルタイムでアドバイスされるようになる。しばらく気づいてなかった。

`rgb(255, 0, 0)` などの文字列をパースするために、[cssparser][] という crate を使っている。
これ Servo organization のリポジトリだ。見つけたときは興奮した。

テストとビルドのため、CircleCI を使った。
macOS と Linux 両方のバイナリを作りたかったので、TravisCI を最初試していたがローカルコマンドのために Gem のインストールを要求されて失敗したり、YAML のフォーマットが理解しにくい感じだったりといまいち感が出てきたため CircleCI にした。
が、そちらでも Rust の macOS 向けクロスコンパイルで失敗して原因がわからなかったので諦めて手元でビルドするようにした。

バイナリの配布のために GitHub Releases と Homebrew を使った。
Homebrew の Formula を作るのは今回が初。思っていたより簡単にできた。

---

`cocore` のアイデアや解決したこと自体が微妙なので記事を書いててテンションが上がらない。
作っている最中の勉強がメインの成果だった。

[github]: https://github.com/KoharaKazuya/cocore
[clippy]: https://github.com/rust-lang/rust-clippy
[cssparser]: https://github.com/servo/rust-cssparser
