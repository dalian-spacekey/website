---
layout: post
title: CentOS6.5にPHP5.5+Slim Framework+PHPUnitの環境を作る その1
date: 2014-05-28
tags: ["PHP","SlimFramework"]
---

PHPアプリケーションの開発環境を構築してみました。

PHPはフレームワークなんかが使われていない時代に触っていましたが、最近はあれこれフレームワークが出てきて当たり前のように使われるようになっています。最近(そして今後の展開も含めて)はどういうものが良いのか調べてみましたが、結局しっくりきたのはマイクロフレームワークの[Slim Framework](http://www.slimframework.com/)でした。
そんなに大規模で複雑なプロジェクトもないだろうし、学習コストとか見通しの良さを考えるといいんじゃないかなぁと。また、ドキュメントを斜め読みしてみると、node.jsでやっていた頭がそのまま使える感じだったのもいい感じです。
情報はそれほど多くなく、ドキュメントも日本語化されていないのですが、元がシンプルなものですし、アプリケーション側もそんなに複雑じゃなければ全然大丈夫です。

また、あわせてPHPUnitやStagehand_TestRunner、Seleniumを使ってユニットテストができるようにしてみたいと思います。

##### 材料

*   CentOS6.5(64bit)......VMWare Player上で構築しています。
*   PHP5.5
*   Composer
*   Slim Framework
*   PHPUnit
*   Stagehand_TestRunner
*   Selenium Server
なにかと試してみたり、失敗してみたり、脱線してみたりするので、VMWare Player+NHMでスナップショットをとりながら進めています。ディスク容量は結構とられますが、SSD環境だったらさくさく動くのでいいですね。

#### PHP5.5

PHPは新しいものを入れます。
普通にyumでインストールすると5.3が入ってしまいますので、remiリポジトリから5.5を入れられるようにします。

##### epelとremiリポジトリの追加

    sudo rpm -Uvh http://ftp.jaist.ac.jp/pub/Linux/Fedora/epel/6/i386/epel-release-6-8.noarch.rpm
    sudo rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm

##### インストール

    yum install --enablerepo=remi-php55 php

phpだけインストールすると、下記も連れ立ってインストールされます。

*   php-cli
*   php-common
*   php-pear
*   php-pecl-jsonc
*   php-pecl-zip
*   php-process
*   php-xml
他にも必要になるものとして、

*   php-mbstring
*   php-mysql
*   php-pdo
*   php-mcrypt
*   php-soap
*   php-pecl-xdebug
なんかを入れておきました。
足りないものがあればまたインストールすればいいんです。

##### httpd.confの修正

mod_rewriteを.htaccessで指定できるようにするため、httpd.confの

*   DirectoryIndexにindex.phpを追加
*   <Directory "/var/www/html">のAllowOverride Allに

##### php.iniの修正

「php.ini 設定」とかでググると先人の知恵がたくさん出てきますので、よしなに......
設定を解説できるだけの知識がないのです。

##### テスト

/var/www/html/info.php

    <?php phpinfo(); ?>

とだけ書いて、http://localhost/info.phpとすると、ちゃんとPHPが動くかどうか確認できます。

#### Composerのインストール

[Composer](https://getcomposer.org/)はパッケージ管理ツールです。
最近はこう言うのがいろんな環境で用意されていて、プロジェクトレベルでコンポーネントを管理できるのでとても便利です。が、数がたくさんありすぎて、それぞれに慣れる領域に到達するまでは完全におまじない状態です。

    curl -s https://getcomposer.org/installer ' php

で、composer.pharというファイルが得られますので、それを

    mv composer.phar /usr/local/bin/composer

とか、リンクを張るとかで「composer」と打てばコマンドが使えるようにしておくと便利です。
そのまま使う場合は、

    php /path/composer.phar install

とか言うことになります。

あとは、コンポーネントを配置したいディレクトリにcomposer.jsonというファイルを作って、そこに入れたいコンポーネントを書いておくと、そのディレクトリで、

    composer install

とかやると、勝手にvendorというフォルダを作って、その中にコンポーネントを配置してくれます。
依存関係のあるものもComposerからインストールできるものなら一緒にインストールしてくれますので、色々考える必要がなくていいですね。

composer.jsonの内容を変えたり、最新のコンポーネントにしたい場合など、一回installした後は

    composer update

をします。

installもupdateも結構時間がかかる場合があります。

また、エラーや警告が出る場合がありますが、だいたいは依存するモジュールがないと言ってくるので、ゆっくりメッセージを読むと「これがない」と書いてありますので別途インストールします。

これでベースとなる環境ができました。