export const containerStyle = css`
  margin: 2rem 0;
  width: 100%;
  padding-bottom: 56.25%;
  position: relative;
`;

export const iframeStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;

/**
 * 上記で template string literal 中の CSS が CSS として認識されるようにするための
 * タグ。実質的に何もせず、ない場合とのと同じ結果になるように実装する。
 */
function css(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += `${values[i]}${strings[i + 1]}`;
  }
  return result;
}
