---
layout: post
title: nginx+php-fpmでslim frameworkのPHPアプリケーションをサブディレクトリで動かす
date: 2014-12-21
tags: ["nginx","PHP"]
---

nginxとphp-fpmでサーバーを作って、slim framework製のPHPアプリケーションを動かす時にちょっと苦労したのでメモしておきます。

アプリケーションのディレクトリ構成としては、/var/www/htmlをWebのdocument rootとしてその下に

    phpsample/
        app/
            vendor/
            composer.json
            その他のディレクトリやフォルダ
        public/
            images/ - 画像
            scripts/ - javascriptなど
            styles/ - cssなど
        index.php

という感じを想定しています。 URLは「http://hoge/phpsample/」で指定するとして、appディレクトリ以下に要求があった場合は、全部phpsample/index.phpにrewriteされるようにする、publicフォルダはそのまま公開するリソースを呼べるようにする、という感じです。

### nginx.conf

ローカルのテスト環境ですし、設定をばらばらするのがいやなのでnginx.confのserverセクションで設定していますが、/etc/nginx/conf.d/の下の設定ファイルでもどこでもいいです。

    location / {
        try_files $uri $uri/ =404;
    }
    location /phpsample/ {
        try_files $uri $uri/ /phpsample/index.php?$args;
    }
    location ^~ /phpsample/app {
        rewrite ^(.*)$ /phpsample/index.php$1 last;
    }

この設定で「http://hoge/」とすると、/var/www/html/index.htmlが表示されますし、phpsample以外のディレクトリやファイルも普通に呼び出せます。  
「http://hoge/phpsample/」で呼び出すと、index.phpが呼ばれてSlimで書かれたアプリケーションが動作してくれますし、publicの下にファイルが存在すればそのファイルが呼び出されます(ディレクトリだけで呼ばれると403 Forbiddenになります)。  
「http://hoge/phpsample/app/」とかで中身をのぞこうとしても、index.phpに飛ばされて処理されるので、そういうルーティングが書かれていなければ、Slimフレームワークの404になります。

### ディレクトリ構成

Slimのドキュメントや、[How to organize a large Slim Framework application](http://www.slimframework.com/news/how-to-organize-a-large-slim-framework-application)というページには、publicフォルダをrootとしてindex.phpもそこに配置、という方向性で書かれているんですが、私としては上記のような形の方が収まりが良いような気がしているのでこうしてます。Apacheで動かす場合も同じ形にしていて、アプリケーションのディレクトリとappディレクトリの両方に.htaccessを置いています。

また、index.phpには全く処理を書かず、

    require_once './app/vendor/autoload.php';
    require_once './app/bootstrap.php';
    $app->run();

とだけ書いてあり、bootstrap.phpに設定とコントローラーなどのファイルをrequireすることにしています。  
これで、index.phpはただのエントリポイント、appにアプリケーション本体がある、publicは公開される実体のあるファイル、という棲み分けになるなぁという感じです。

nginxの設定がいまいち身についていないので、ここに至るまでかなり試行錯誤しました。うまく動いている感じですが、何となくしっくりきていないのでもっと良い方法があるのかもしれません。もうちょっとnginxを勉強しないといけません。