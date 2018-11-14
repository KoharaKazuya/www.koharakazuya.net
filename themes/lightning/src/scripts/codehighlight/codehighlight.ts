import { importScript, importStyle } from "../lib/dynamic-import";

let highlightjsLoad: Promise<unknown> | undefined;

/**
 * 表示中の全ての <code> 要素中のテキストをシンタックスハイライトする
 */
export async function codeHighlight(): Promise<void> {
  // highlight.js がロード済みでなければロードする
  if (!highlightjsLoad)
    highlightjsLoad = Promise.all([
      importScript(
        "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js",
        "sha384-BlPof9RtjBqeJFskKv3sK3dh4Wk70iKlpIe92FeVN+6qxaGUOUu+mZNpALZ+K7ya"
      ),
      importStyle(
        "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/github.min.css",
        "sha384-WtUWHyk39lfUpZQVgokNfSKCJaKAeD6adgLduBLrKTMUuPzFhLtL23y1guFy6lZn"
      )
    ]);
  await highlightjsLoad;

  // 全てのコードブロックをハイライトする
  Array.prototype.forEach.call(
    document.querySelectorAll('pre code[class^="language-"]'),
    hljs.highlightBlock
  );
}
