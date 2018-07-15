---
layout: post
title: CentOS7にPHP5.6をインストールしてPHPのビルトインサーバーでSlimを動かす
date: 2014-12-18
tags: ["CentOS","PHP"]
---

### PHP5.6のインストール

PHP5.6はremiリポジトリから。

    # rpm -Uvh http://ftp.iij.ad.jp/pub/linux/fedora/epel/7/x86_64/e/epel-release-7-5.noarch.rpm
    rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm

    # yum install --enablerepo=remi --enablerepo=remi-php56 php php-mbstring php-mysql php-pdo php-mcrypt php-soap php-pecl-xdebug php-devel php-fpm

    # php -v
    PHP 5.6.3 (cli) (built: Nov 16 2014 08:32:30)
    Copyright (c) 1997-2014 The PHP Group
    Zend Engine v2.6.0, Copyright (c) 1998-2014 Zend Technologies
        with Xdebug v2.2.6, Copyright (c) 2002-2014, by Derick Rethans

とりあえずこんな感じで。

### PHP5.6の動作確認

/var/www/html/index.phpを作っておく。

    ＜?php phpinfo();

PHPのビルトインサーバーを起動します。
(firewall-cmdで80番をあけておきます)

    # php -S 192.168.47.128:80 -t /var/www/html

これで指定のサーバーでphpinfoが表示されます。

### Slimのインストールと動作確認

[CentOS6.5にPHP5.5+Slim Framework+PHPUnitの環境を作る その2](http://spacekey.info/638/ "CentOS6.5にPHP5.5+Slim Framework+PHPUnitの環境を作る その2")に沿って、Composerのインストールをしてから、アプリケーションフォルダを作ってSlimフレームワークをセットアップします。

ただし、今回はPHPのビルトインサーバーを使うので、.htaccessは不要です。
そのままアプリケーションの記述をして動かせば大丈夫です。

PHPのビルトインサーバーは、存在しないものを指定した場合はindex.htmlやindex.phpを探して読みに行くようです。ただし、指定したディレクトリが存在していて、そこにindex.htmlやindex.phpがない場合は404 Not Foundを返します。

これでお手軽PHP動作環境が整いました。
ちゃんと運用する場合は、ビルトインサーバーは使わずnginxとかApacheなどで動かすべきですが、ちょっと試してみたいことがあるとかぐらいならこれで十分じゃないでしょうか。