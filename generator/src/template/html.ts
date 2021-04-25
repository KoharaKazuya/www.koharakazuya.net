type Variables = {
  title: string;
  authorName: string;
  description: string;
  thumbnail?: string;
  canonicalUrl: string;
  style: string;
  app: string;
  gaId: string;
};

export function createHtml({
  title,
  authorName,
  description,
  thumbnail,
  canonicalUrl,
  style,
  app,
  gaId,
}: Variables) {
  return html`
    <!DOCTYPE html>
    <html lang="ja-jp">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,viewport-fit=cover"
        />

        <title>${escape(title)}</title>
        <meta name="author" content="${escape(authorName)}" />
        <meta name="description" content="${escape(description)}" />
        <link rel="icon" href="/favicon.png" />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Feed"
          href="/index.xml"
        />

        <meta property="og:title" content="${escape(title)}" />
        <meta property="og:type" content="website" />
        ${thumbnail
          ? `<meta property="og:image" content="${escape(thumbnail)}">`
          : ""}
        <meta property="og:url" content="${escape(canonicalUrl)}" />

        <style>
          ${style}
        </style>

        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=${gaId}"
        ></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "${gaId}");
        </script>

        <script nomodule src="/main.es5.js" defer></script>
        <script type="module" src="/main.js"></script>
      </head>
      <body>
        ${app}
      </body>
    </html>
  `;
}

/**
 * 上記で template string literal 中の HTML が HTML として認識されるようにするための
 * タグ。実質的に何もせず、ない場合とのと同じ結果になるように実装する。
 */
function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += `${values[i]}${strings[i + 1]}`;
  }
  return result;
}

/**
 * HTML の特殊文字をエスケープする
 */
function escape(x: string): string {
  return x
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
