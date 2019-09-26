---
layout: post
title: gitmikeのフォント
date: 2014-11-18
tags: ["Redmine"]
---

Remineに[gitmike](https://github.com/makotokw/redmine-theme-gitmike)テーマを入れたら、なんかALMiniumで入れたときと雰囲気が違うので、あれ？となりました。
フォントがMeiryoになってないんですね。

なんかインストール失敗したかと思ったんですが、git cloneするだけなので失敗のしようもないし......と思って調べてみたら、こういうことでした。

[GitHubっぽいRedmineテーマ少し更新](http://blog.makotokw.com/2013/07/12/github%E3%81%A3%E3%81%BD%E3%81%84redmine%E3%83%86%E3%83%BC%E3%83%9E%E5%B0%91%E3%81%97%E6%9B%B4%E6%96%B0/)

日本語以外の環境で使う場合にフォントがおかしくなるので、日本語用は別のブランチになってると言うことです。
今は、r5_japanese_fontが最新っぽいので、テーマのフォルダで下記の要領でチェックアウトしておくとちゃんとMeiryoで表示されるようになりました。

    git checkout -b ja r5_japanese_font
    