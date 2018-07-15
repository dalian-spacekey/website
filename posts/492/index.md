---
layout: post
title: CentOS 6.4 にAlminiumをインストール
date: 2013-07-15
tags: ["Alminium"]
---

さくらのVPS(CentOS 6.4)に、Alminiumをインストールしようとしたら引っかかったところがあったのでメモ。

bash ./smelt

してから、終わるまで放置していて画面を見てみたら、最後httpdの再起動でエラーが出て止まっていた。

    httpd を起動中: httpd: Syntax error on line 221 of /etc/httpd/conf/httpd.conf: S
    yntax error on line 1 of /etc/httpd/conf.d/redmine.conf: Cannot load /usr/lib64/
    ruby/gems/2.0.0/gems/passenger-4.0.7/libout/apache2/mod_passenger.so into server
    : /usr/lib64/ruby/gems/2.0.0/gems/passenger-4.0.7/libout/apache2/mod_passenger.s
    o: cannot open shared object file: No such file or directory

/etc/httpd/conf.d/redmine.confの1行目、mod_passenger.soが見つからないとのこと。
調べてみたら、どうもliboutではなくbuildoutというフォルダにあるので、その部分を書き換えてhttpdを再起動すればOKだった。