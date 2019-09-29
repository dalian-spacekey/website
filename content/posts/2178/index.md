---
title: "[HUGO]sitemap.xmlを調整する"
date: "2019-09-29 0:00:00"
tags: ["Hugo"]
---

Google Search Consoleが、"Submitted URL blocked by robots.txt"という警告を出しているので対処してみます。

<!--more-->

素材はこのサイトです。[dalian-spacekey/website](https://github.com/dalian-spacekey/website)

## 現象

```
https://spacekey.info/tags/document/
https://spacekey.info/tags/meteor/
https://spacekey.info/tags/git/
...
```

といった、タグ事の記事リストページが軒並みクロール出来ないみたいです。  
ちょっとなんで駄目なのかわかりませんが、特にリストのページをクロールしてもらう必要はないので対象外になるようにしましょう。

* robots.txtは明示的に出力していない
* sitemap.xmlはhugoが生成するデフォルト(生成されるすべてのページが含まれている)

## 対応

1. robots.txtを明示的に出力する
2. sitemap.xmlからリストなど自動生成されるようなものを外して、コンテンツだけにする

### 1. robots.txtを明示的に出力する

config.tomlに下記を追加。

```
enableRobotsTXT = true
```

これで、

```
User-agent: *
```

だけが書かれたrobots.txtを出力してくれるようになりますが、明示的にsitemap.xmlを読んでもらいたいので、/layouts/robots.txtを用意します。

```
User-agent: *
Sitemap: {{ .Site.BaseURL }}sitemap.xml
```

こうするとこの内容でrobots.txtを出力してくれます。もし何かブロックしたいとか調整したければ、ここで制御することになります。

### 2. sitemap.xmlからリストなど自動生成されるようなものを外して、コンテンツだけにする

これもrobots.txtと同様に、/layouts/sitemap.xmlを用意しておけばその通り出てくれますので、中身のあるページだけが出力されるようにしておきます。

```
{{ printf "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\" ?>" | safeHTML }}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  {{ range .Site.RegularPages }}
    {{ if .IsPage }}
    <url>
      <loc>{{ .Permalink }}</loc>
      {{ if .Lastmod }}
      <lastmod>{{ safeHTML ( .Lastmod.Format "2006-01-02T15:04:05-07:00" ) }}</lastmod>
      {{ end }}
    </url>
    {{ end }}
  {{ end }}

</urlset>
```

## 結果

ローカルでビルドしてみて、robots.txtと指定したsitemap.xmlが出るのを確認しました。  
あとはデプロイしてクロールされたときにわかるでしょう。

sitemap.xmlについては、制御文が入ってるところが空白で出力されてるので、人が見たら無駄な改行が入ってる間延びしたxmlになってしまってるのがちょっと気になります。  
かといって変に詰めて書くのも嫌だなぁ。  
人間がどっちを見るかって言うと、出力する前の状態ですからね。