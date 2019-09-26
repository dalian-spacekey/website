---
layout: post
title: Slim Framework + Smarty
date: 2014-05-29
tags: ["PHP","SlimFramework"]
---

Slim Frameworkでテンプレートエンジンの[Smarty](http://www.smarty.net/)を使えるようにしてみます。

#### セットアップ

composer.jsonはこんな感じです。

    {
    	"require": {
    		"slim/slim": "2.*",
    		"slim/views": "0.1.*",
    		"smarty/smarty": "3.*"
    	}
    }

smartyとともに、[Slim-Views](https://github.com/codeguy/Slim-Views)と言うものを入れる必要があります。
環境の準備はこれだけです。
Slim-Viewsの説明を見ながらやってみます。

#### 構成

ディレクトリとファイルの構成は下記のようになります。

    project/
        cache/
        templates/
            index.tpl
        compiled/
        vendor/
        index.php
        composer.json
        .htaccess

cacheディレクトリと、compiledディレクトリは、smartyが使うものです。
cacheはなにかキャッシュするんでしょうけど、まだ何かわかりません。
compiledディレクトリは書き込み可能にしておかないとエラーが出ます。

#### index.tpl

ページのテンプレートを作成します。

    <!DOCTYPE html>
    <html>
    	<head>
    		<title>Smarty</title>
    		<meta charset="UTF-8">
    	</head>
    <body>
    <h1>Smarty</h1>
    {$name}
    </body>
    </html>

超簡単に、$nameをもらって出力するだけです。

#### index.php

smartyを使うための設定があれこれ入ってきます。

    <?php
    require_once 'vendor/autoload.php';

    $app = new Slim\Slim(array(
        'debug' => true,
        'templates.path' => 'templates',
        'view' => new \Slim\Views\Smarty(),
    ));

    $view = $app->view();
    $view->parserDirectory = dirname(__FILE__) . 'smarty';
    $view->parserCompileDirectory = dirname(__FILE__) . '/compiled';
    $view->parserCacheDirectory = dirname(__FILE__) . '/cache';

    $app->get('/', function () use($app){
        $app->render('index.tpl', array('name' => "spacekey"));
    });

    $app->run();

これだけです。