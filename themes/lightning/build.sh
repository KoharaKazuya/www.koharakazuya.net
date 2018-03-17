#!/bin/sh

set -eu

cd "$(dirname "$0")"

# static 以下の以前までの成果物を削除
git clean -xf -- static

# js, css ファイルを作成
(cd ./scripts; yarn run build)
(cd ./styles;  yarn run build)

# js ファイルのファイル名を取得
script="$(basename static/app-*.js)"
# css ファイルのファイル名を取得
style="$(basename static/full.*.css)"

# js, css ファイルの読み込み HTML を作成
cat <<EOS > ./layouts/partials/head-injections.html
  {{/* クリティカル CSS を HTML に埋め込み */}}
  {{ if eq .Kind "404" }}
  <style>{{ (partial "critical-404.css" .) | safeCSS }}</style>
  {{ else if .IsPage }}
  <style>{{ (partial "critical-single.css" .) | safeCSS }}</style>
  {{ else }}
  <style>{{ (partial "critical-list.css" .) | safeCSS }}</style>
  {{ end }}

  {{/* JavaScript を非同期でロード */}}
  <script>
    function lightningLoad(src) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      document.head.appendChild(s);
    }
    function lightningAppLoad() {
      lightningLoad('{{ .Site.BaseURL }}$script');
    }
    requestAnimationFrame(function() {
      if (window.Promise) {
        lightningAppLoad();
      } else {
        lightningLoad('https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise&callback=lightningAppLoad');
      }
    });
  </script>
EOS

# css ファイルの読み込み HTML を作成
cat <<EOS > ./layouts/partials/body-injections.html
  {{/* クリティカル CSS 以外のフル CSS を非同期で読み込む */}}
  <script>
    requestAnimationFrame(function() {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = '{{ .Site.BaseURL }}$style';
      document.head.appendChild(l);
    });
  </script>
EOS
