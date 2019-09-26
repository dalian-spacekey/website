---
layout: post
title: SyntaxHighlighter Evolvedをやめてhighlight.jsにしてみた
date: 2014-12-01
tags: ["JavaScript"]
---

コードハイライトは、SyntaxHighlighter Evolvedを使っていたんですが、表示されるまでに時間がかかるし、スタイルを変更するのがなにかとめんどくさくて、イマイチしっくりきていませんでした。

他に何かプラグインはないかと探していたんですが、プラグインを探し当てる前に[highlight.js](https://highlightjs.org/)というjavascriptのライブラリを見つけました。

    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.2/styles/default.min.css"/>
    <script src="highlight.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>

ヘッダにこれを入れておけば、<pre><code>から</code></pre>の部分を自動的に判別して、コードハイライトしてくれます。
[live demo](https://highlightjs.org/static/demo/)を見ると、対応言語が112、表示スタイルも49個もあります。

自動判別にまかせるだけじゃなくて、<pre><code class="csharp">とか指定すれば、言語を指定することもできます。

他のプラグインのように多機能な表示はできないのですが、私としてはコード的なところがそれっぽく表示できればそれでいいですし、スタイルも設定しやすいのでこれで十分すぎる感じです。

[plain][/plain]とか[html][/html]とか書いてるところを修正するのが手間でしたが、表示も速くなった感じですし、表示位置もうまくおさまったので、かけた手間分はあったと思います。