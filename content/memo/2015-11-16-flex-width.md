+++
date = "2015-11-16T20:25:42+09:00"
title = "潰れた Flex の不思議な挙動"
thumbnail = ""
+++

```html
<div style="display: flex;">
  <input style="flex: 1;">
  <div style="flex: 0 1 600px; background-color: green;"></div>
</div>
```

上記のコードでは、右の緑の領域が基本 600 px あって、左の入力欄は残りの部分で
伸縮する、また、（ブラウザサイズなどの）全体の幅が小さくなるに連れ、
入力欄が小さくなり、幅が 0 になると右の緑の領域の幅が小さくなっていく。
という意図で書いた。

実際は以下。
PC でブラウザのウィンドウサイズを色々変えてみて試してほしい。

<div style="display: flex;">
  <input style="flex: 1;">
  <div style="flex: 0 1 600px; background-color: green;"></div>
</div>

Safari, FireFox では意図の通りの挙動をしたが、
Google Chrome 46 では **入力欄の幅が 0 になる付近で固定幅になる** という謎の
挙動を示した。ホント謎。
div はならず、input だけだったのでバグっぽい感じはあるんだけど、どうなんだろう。

（この記事は仕事中に苦しんだバグを再現しようと思って書き始められましたが、
再現ができずに別のバグっぽいものを見つけたため、そちらが記されました）
