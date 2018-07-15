---
layout: post
title: Laravelのセットアップ
date: 2015-02-04
tags: ["PHP"]
---

あるプロジェクトでLaravelを使うことになったので、とりあえず入れて動かすところまでやってみました。

#### インストール

composerで入れます。

    composer create-project laravel/laravel laravelsample

何をやったのかというと、laravel/laravelというひな形がlaravelsampleというディレクトリにコピーされて下記の構成になります。

    laravelsample/
    	app/
    	bootstrap/
    	public/
    	.gitattributes
    	.gitignore
    	artisan
    	composer.json
    	CONTRIBUTING.md
    	phpunit.xml
    	readme.md
    	server.php
    	upgrade.md

そのあと、composer.jsonのrequireで指定されているコンポーネントがダウンロードされたりするわけです。

Laravelは結構な量のコンポーネントで構成されているので完了するまでちょっとだけ時間がかかります。

#### Laravel 4.1をセットアップする

最新版のLaravelはphp5.4以上でなければならないのですが、今回のプロジェクトはphp5.3.10の環境と言うことなので、最新版は使えません。4.1であればPHP5.3.7以降で動作するので、composerでプロジェクトを作成するときに下記のように指定することになります。

    composer create-project laravel/laravel laravelsample 4.1

最後にバージョンをつけます。  
そうすると、composerのリポジトリから適したバージョンがダウンロードされます。

    cd laravelsample
    php artisan --version

でLaravelフレームワークのバージョンがわかります。