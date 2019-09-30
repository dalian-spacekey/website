---
title: "[HUGO]リンク先のmetaデータを読んで、リンクをいい感じに表示してみる"
date: "2019-09-30 0:00:00"
tags: ["Hugo"]
---

[OGPのmetaタグをセットしてtwitterとかでいい感じに表示されるようにしました](https://spacekey.info/posts/2176/)が、今度は自分の記事内によそのリンクを貼るときにいい感じにしてみようと思います。

<!--more-->

※OGPのことについて調べると、この「いい感じに表示されるリンク」に具体的な名前がなく、どこに行っても「いい感じに表示されるやつ」としか表現されてませんね。

素材はこのサイトです。[dalian-spacekey/website](https://github.com/dalian-spacekey/website)

## 対応内容

1. 記事内で、ショートコードでURLを指定する
2. URLのページからOGPタグの内容を取得する
3. いい感じに表示する

ショートコードは記事内で使えるタグのようなもので、/layouts/shortcodesディレクトリにテンプレートとして書いておくことで使えます。

/layouts/linkcard.html

```html
{{ $url := .Get 0 }}
{{ $function := print (getenv "SOCIALMETADATA_ENDPOINT") "&" (querify "url" $url )}}
{{ $json := getJSON $function }}

<div class="linkcard">
  <a href="{{ $url | safeHTMLAttr }}" target="_blank"></a>

  {{ with $json.ogImage }}
  <div class="linkcard-left">
    <img src="{{ . | safeHTMLAttr }}"/>
  </div>
  {{ end }}
  {{ with $json.title }}
  <div class="linkcard-right linkcard-title">
    {{ $json.title }}
  </div>
  {{ end }}
  <div class="linkcard-right linkcard-url">
    {{ $json.url }}
  </div>
  {{ with $json.ogDescription }}
  <div class="linkcard-right linkcard-description">
    {{ $json.ogDescription }}
  </div>
  {{ end }}
</div>
```

これで、記事の中に下記のようにしておけば、linkcard.htmlで書いた内容が表示されます。

<pre>
{{&lt;linkcard "リンク先のURL"&gt;}}
</pre>

↓実際の例

{{<linkcard "https://spacekey.info/posts/2176/">}}

.Get 0で引数がとれるので、それをAzure Functionに投げて、jsonでmetaタグの内容を取得して、その内容でHTMLを作って出力しています。

HUGOでは、サイトの外からデータをとってくる手段がgetJSONとgetCSVしかなく、対象のURLから直接スクレイピングすることも出来ないため、代わりにmetaデータをとってくる仕組みが必要になります。今回それを、Azure Functionで行っています。

Azure FunctionはURLにキーが入ってるので、ソースに書いてGitHubにアップロードするわけにも行かないため、とりあえずNetlifyの環境変数に設定しておいて、そこから取得することにしています。

一番時間がかかるのはHTMLとCSSというのが毎度毎度頭の痛いところですが、なんかちょっといい感じに出力されるようになった気がします。

データをとってくるAzure Functionについてはこちら(早速実戦で活用)

{{<linkcard "https://spacekey.info/posts/2181/">}}

