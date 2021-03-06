---
title: "[HUGO]ホームかどうか判断してtitleタグの内容を変える"
date: "2019-09-26 1:00:00"
tags: ["Hugo"]
---

titleタグが出力出来ていなかったので対応していきます。

<!--more-->

素材はこのサイトです。[dalian-spacekey/website](https://github.com/dalian-spacekey/website)

## 仕様

titleタグを動的に出力する。

1. ホームの場合は、config.tomlに設定されているサイト名(title)だけを出力
2. 投稿またはタグページの場合は、「投稿タイトル/タグ | サイト名」を出力

## 実装

* ホームが表示された場合、「.IsHome」がtrueになるので、それを判断して出力します。
* サイト名は「.Site.Title」、呼ばれたページのタイトルは「.Title」で参照できます。

よって、layouts/partials/head.htmlに、

```html
<title>{{ if not .IsHome }}{{ .Title }} |{{ end }} {{ .Site.Title }}</title>
```

としてやると、ホームじゃないときはページのタイトルが、ホームの時はサイトのタイトルだけが表示されます。