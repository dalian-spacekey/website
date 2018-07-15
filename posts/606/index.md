---
layout: post
title: node.jsでhttpで来たのをhttpsにリダイレクトする
date: 2013-12-06
tags: ["JavaScript","node.js"]
---

準備中のサービスはhttpで作っていたのですが、やっぱり早いうちにhttpsにしておこうと思い、とりあえずRapidSSLで安いやつを導入してみました。

それに伴い、node.jsの方をhttpsモジュールを使ってlistenするように変更するわけですが、80番で待たないようにしてしまったら思わずhttpsのsをうち忘れたりしたときにページが出なくなりますね。
なので、httpでも待っておいてそっちできてしまったらhttpsにリダイレクトしてあげたらいいかと思って方法を探してみたら、

    if (req.headers['x-forwarded-proto'] === 'https')
    next();
    else
    redirectうんぬん

というのをいくつか見たので試してみたんですが、なんかhttpsでアクセスしてもリダイレクトループしてしまう。
調べてみたらx-forwarded-protoがundefinedで来てるんですよね......

[Expressのリファレンス](http://expressjs.com/api.html)を見たら、req.protocolでhttpとかhttpsなどが返ってくるようなのでそれを見るようにしたらできました。
req.secureが「'https' == req.protocol」と同価らしいのでそれで判断しても良いですね。

あと、なんか今ちょっと思いついたんですが、どうせこのサーバーはこのサービス用にしか使うつもりがないので、iptableで80に来たやつを443に無理から転送してしまうと言うのもありなのかな？(試してないですけど)。