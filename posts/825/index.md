---
layout: post
title: "Fatal error: Call to undefined function http_redirect()"
date: 2015-02-09
tags: ["PHP"]
---

CentOS7 + PHP 5.6.3で、単純にhttp_redirectを使おうとしたら、

    Fatal error: Call to undefined function http_redirect()

とかでました。

と言うのも、現在PHPをまったくの0から教えるということを始めていて、フレームワーク等一切使わず、プレーンなPHPでHello WorldやPOSTしてみたり......を順番にやってみてます。
で、私自身も試しに動かしてみたりするんですが、「登録して一覧にリダイレクト」みたいなごく基本的なことをやろうとして引っかかりました。

原因は、pecl_httpのバージョンが2になっているからです。

現在の最新は、2.2.0。
2.0.0以降はv1系と全く違うものになっているらしく、後方互換性がなくなっています。要するにhttp_redirectという関数はなくなっているのです。これだけじゃなくて他にも沢山使えなくなっています。

解決策としては、v1系をインストールすることなのですが、PHP5.6だとだめな感じです。

    # yum list --enablerepo=remi --enablerepo=remi-php56 ' grep php-pecl-http
    php-pecl-http.x86_64 2.2.0-1.el7.remi.5.6 @remi-php56
    php-pecl-http-devel.x86_64 2.2.0-1.el7.remi.5.6 remi-php56
    php-pecl-http1.x86_64 1.7.6-4.el7.remi.5.4 remi
    php-pecl-http1-devel.x86_64 1.7.6-4.el7.remi.5.4 remi
    php54-php-pecl-http.x86_64 2.2.0-1.el7.remi remi
    php54-php-pecl-http-devel.x86_64 2.2.0-1.el7.remi remi
    php54-php-pecl-http1.x86_64 1.7.6-5.el7.remi remi
    php54-php-pecl-http1-devel.x86_64 1.7.6-5.el7.remi remi
    php55-php-pecl-http.x86_64 2.2.0-1.el7.remi remi
    php55-php-pecl-http-devel.x86_64 2.2.0-1.el7.remi remi
    php55-php-pecl-http1.x86_64 1.7.6-5.el7.remi remi
    php55-php-pecl-http1-devel.x86_64 1.7.6-5.el7.remi remi
    php56-php-pecl-http.x86_64 2.2.0-1.el7.remi remi
    php56-php-pecl-http-devel.x86_64 2.2.0-1.el7.remi remi

とかすると、php-pecl-http1というv1系のものがあるんですが、php5.6はだめみたいです。
インストールしようとしても、

    パッケージ php-pecl-http1 は php-pecl-http によって不要になりました。代わりに php-pecl-http-2.2.0-1.el7.remi.5.6.x86_64 のインストールを試みています。

と結局2.2.0がインストールされてしまいます。

何で後方互換性がなくなっちゃったのか経緯がよくわからないので釈然としませんが、まあそうなっちゃったものは仕方がないです。
リダイレクトしたいだけなら、

    header('Location: url');

すればいいので。

#### 参考

開発元：[http://devel-m6w6.rhcloud.com/mdref/http](http://devel-m6w6.rhcloud.com/mdref/http)

このページのCommentsの先頭に、「なんでこんなに変わっちゃったんだよ」的なコメントがありますが、返事はないようです。