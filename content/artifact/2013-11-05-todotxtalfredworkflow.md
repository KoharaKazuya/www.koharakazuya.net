+++
date = "2013-11-05T00:00:00+09:00"
title = "Alfred 用の Todo.txt 連携ワークフローを作った"
thumbnail = "//www.alfredapp.com/images/logo.png"
+++

[Alfred](http://www.alfredapp.com/) といえば QuickSilver に並んで Mac で有名なコマンドランチャーアプリ。
無料版は機能制限されているんだけど、先日我慢できずにライセンスを購入。
約 2,700 円だったけど、後悔は（まだ）していない。

せっかく買ったんだから開放された機能をガッツリ弄っていたら、[Todo.txt](http://todotxt.com/) を Alfred から操作したくなった。
Todo.txt は TODO 管理データをテキストで扱うってところが味噌のアプリ。
Web サービス利用系はサービスが終了すれば消えるし、他のバイナリでデータ管理しているアプリもエクスポートが面倒。
将来的にずっと使える保証があるのはテキストデータだけでしょ、ってことで使ってます。
**なにより CLI があるのが一番ですが。**

Todo.txt を扱う Alfred Workflow は[既にあるっぽい](https://github.com/madc/alfred-todotxt)ですが、
Alfred のせっかくの機能を十分に活かしきれていなかったみたいなので、
自分で作ることにしました。ただのシェルスクリプトだし。

シンプルなラッパーとして`todo add test`→通知、みたいなこともできますが、
`add`,`do`,`list`に対して特化したコマンドを追加してます。

![Alfred 上から Todo.txt のタスクを表示](/images/2013-11-05-todotxtalfredworkflow.png)

こんな感じに。
`todo`がただのラッパー。
`to [task]`で新規タスクの追加。
`list`で現在のタスクの確認。
`done [task_number]`でタスクの完了が出来ます。

もし良かったら使って見て下さい。

[*Download*](/bin/Todo.txt.alfredworkflow)
