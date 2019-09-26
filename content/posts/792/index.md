---
layout: post
title: nginx+php-fpmでphpを動かす
date: 2014-12-19
tags: ["CentOS","PHP"]
---

phpをapacheを使わず、nginx+php-fpmで動かすようにしてみます。
環境は、[前回](http://spacekey.info/774/ "CentOS7にPHP5.6をインストールしてPHPのビルトインサーバーでSlimを動かす")のそのまま続きで、CentOS7+PHP5.6の状態に、nginxがインストールして特に何も設定を変えず起動もしていない状態からスタートです。

### php-fpmのインストール

php-fpmは、でphpをインストールしたときと同じようにremiリポジトリからyumでインストールします。
その後は、/etc/php-fpm.d/www.confを書き換えます。

    user = apache
    group = apache

のapacheをnginxに変えるだけです。

    systemctl enable php-fpm
    systemctl start php-fpm

で、起動時実行の設定をしておいて起動します。 php-fpmはこれだけです。

### nginxの設定

あとは、nginxの方で、「*.phpが呼ばれたら、php-fpmに投げる」という設定をしてあげればOKです。
/etc/nginx/nginx.confか/etc/nginx/conf.dの下のconfファイルとか適当なところに、

    location ~ \.php$ {
        root           /usr/share/nginx/html;
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }

と言う記述をしてあげます。 rootなどはnginxがインストールされたときの状態のままです。

    systemctl enable nginx
    systemctl start nginx

これも同じく、起動時の実行を設定しておいて起動します。

### 動作確認

/usr/share/nginx/htmlに例のphpinfo()だけのindex.phpを用意して確認するだけです。
インストールや設定に問題がなければよく見るページが出てきます。

### トラブル

と、いかにも簡単に書いてますが、実はphpinfoが表示されるまで2時間以上ハマっていました。
どうやっても、phpファイルが実行されず、ファイルのダウンロードになってしまうのです。

ハマりポイントとしては、fastcgi_paramの設定が正しくphpファイルを指さない、とかfastcgi_passをunixソケットにしてうまくいかないとかが多く重点的に調べたのですがだめでした。原因はわからないまま設定ファイルを見直したり、整形したりとかしながら点検していたのですが、なんか突然動くようになってしまいました。なんか設定触ったかと思い、順番に戻してみたんですがそれでもちゃんと動く......
原因がなんだったかはっきりしない、こう言うのが一番困りますね。

かろうじてもしかして......というのは、php-fpmを設定ファイルを書き換えずにいきなり実行してしまって、あとからwww.confを書き換えたり、unixソケットにして見たりと、ちゃんと基本の設定で動作するのを確認しないまま色々設定を書き換えては、systemctl restart php-fpmで再起動していたからかもしれない、というあたりです。
動くようになる前に、systemctl stop php-fpmでサービスを停止させたりしたので変な設定のまま動いていたのかなぁというあたりでしょうか。

ちょっとハマりすぎて疲れたのでそこまで再検証していませんが、気力が復活したらsystemctl restart php-fpmが大丈夫なのか確認して見ます。