---
layout: post
title: IEのDate.parseでハマる
date: 2013-07-17
tags: ["JavaScript"]
---

最近、スケジュールをガントチャート的に表示するJavaScriptのプログラムを書いているのですが、しょうもないことでかなりはまったのでメモしておきます。

もともとあるシステムの仕様で、データベースから日付を持ってくる際には「2013-07-15T12:34:56+09:00」という文字列になってくるようになっています。
これを昨日の段階では、普通に「Date()」に放り込んで日付型にしていて普通に動いていました。
JavaScriptはDateのパースにちょっと癖がありますが、実際に動作するのを確認して安心しておりました。

ところが今日の朝、昨日の続きをしようとまずはプログラムを実行してみたら、なんか日付を扱うところのコードがちゃんと動かないのです。昨日からコードが変わったはずもなく、自分以外の人が触る状況でもなく、どうやっても日付への変換がうまくいっていない。来ている日付文字列の形式も変わっていないのです。
相当悩みました。もしかしたら昨日動いていたのは夢だったのではないかと......

そしたらIEのデバッガを見て気が付きました(使っているのはWindows8のIE10)。
ドキュメントモードが「IE7 標準」になっていたのを「IE9 標準」に変えてみました。

動作しました。

「IE8 標準」でも動作しません。おそらく昨日の段階では、IE9標準で表示されていたのでしょう。

理由はわかりましたが、このシステムはIE8でも動作しないといけませんので、どう変えればよいのかを調べた結果、

「2013/07/15T12:34:56+0900」

といった感じで、ハイフンをスラッシュに、タイムゾーンのコロンを削除すればよさそうなことがわかりましたので、日付の文字列をいったん変換してからDateに食わせることにしました。

    hoge.replace(
        /(\d{4})-(\d{2})-(\d{2})(T\d{2}:\d{2}:\d{2})(\.\d{2})?(\+\d{2}):(\d{2})/,
        '$1\/$2\/$3$4$6$7')

こんな感じです。
システムの仕様でなぜか、「2013-07-15T12:34:56<span style="color: #ff0000;">.00</span>+09:00」とミリ秒部分が入ったり入ってなかったりするという状況だったのでコンマ以下の部分も省くようになっています。