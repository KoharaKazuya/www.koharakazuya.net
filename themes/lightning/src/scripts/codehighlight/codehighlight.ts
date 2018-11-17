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
      ).then(() =>
        Promise.all([
          importScript(
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/go.min.js",
            "sha256-LVuWfOU0rWFMCJNl1xb3K2HSWfxtK4IPbqEerP1P83M="
          ),
          importScript(
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/rust.min.js",
            "sha256-8lS5Qc8uYpAmF/KS5Tbem9ogZo4+/z+JWMgk2rwmRyE="
          ),
          importScript(
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/scss.min.js",
            "sha256-/27cA5aA9DgzXPb747VxVTzwPG/X5tihoKySMSq3bwk="
          ),
          importScript(
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/yaml.min.js",
            "sha256-GuL67zsJWO0bMHHaASSslF37TSgnQF5fuL2n80/HpoU="
          )
        ])
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
