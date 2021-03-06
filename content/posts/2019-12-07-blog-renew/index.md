---
date: "2019-12-07T17:03:00+09:00"
thumbnail: ./blog-renew_after.png
title: ブログの外観を少し修正した
tags:
  - CSS
  - JavaScript
---

Google Search Console や Lighthouse から文字が小さい、コントラストが小さい、等の指摘が出てて気になっていたので修正した。

僕自身が他人のブログを見るとき、筆者情報とコンテンツ以外に興味がないので、記事のメイン部分のコンテンツ以外を極力排除しようとしたが、流石にやりすぎたためアクセシビリティがよくなかったようだ。

修正前の外観

![修正前の外観](./blog-renew_before.png)

修正後の外観

![修正後の外観](./blog-renew_after.png)

文字サイズはレイアウトに影響するので、日付の位置などマイナーチェンジしている。

また、著者情報の部分の Twitter, GitHub へのリンクのアイコンが小さすぎるという指摘もあったので、全体をリンクに変更し、自己紹介ページに飛ばすようにした。自己紹介ページは新しく作った。

自己紹介ページへナビゲーションが弱すぎて見つけづらいと思うが、読者は著者情報よりコンテンツの方がはるかに見たいと思うので、著者に興味が出てクリックしたときに見れたらそれでいいはず。

ついでにかねてから対応しておきたいと思っていた Web Share API を使った。
