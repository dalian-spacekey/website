---
layout: post
title: Slim Framework 3.0
date: 2015-12-11
tags: ["PHP","SlimFramework"]
---

[Slim Framework](http://www.slimframework.com/)の3.0が12/7に正式リリースされました。

→[Slim 3.0.0 released!](http://www.slimframework.com/2015/12/07/slim-3.html)

ちょうど、あるC#で作っているアプリケーションの動作確認用サーバーAPIをSlimで書いていたので、それを3.0にしてみました。
結論から言うとそのまま動きません。いろいろ書き方が変わってます。

## Slim 2.6のコード

下記がSlim2.6仕様のコード。アプリケーション側のコードを試すためだけに書いたので、非常に単純なものです。index.phpにベタ書きしています。
最初の方のいくつかは、Slim自体の動作確認用に書いてあるものです。

    <?php
    require 'vendor/autoload.php';

    $app = new \Slim\Slim();

    $app->get('/', function () {
        echo "Index";
    });

    $app->get('/hello', function () {
        echo "Hello!";
    });

    $app->get('/hello/:name', function ($name) {
        echo "Hello, $name!";
    });

    $app->get('/json', function () {
        $json_array = array(
            'name' => 'fumihiro fukuda',
            'company' => 'dalian spacekey'
        );

        echo json_encode($json_array);
    });

    $app->post('/post', function () use ($app) {
        $array = json_decode($app->request->getBody(), true);

        $json_array = array(
            'response_name' => $array["name"],
            'response_company' => $array["company"]
        );

        echo json_encode($json_array);
    });

    $app->post('/login', function () use ($app) {
        $array = json_decode($app->request->getBody(), true);

        $login_id = $array["login_id"];
        $login_pw = $array["login_pw"];

        if ($login_id == 'success') {
            $json_array = array(
                'user_name' => 'test name',
                'user_serial' => 'ABCDEFGH'
            );

            $app->response->setStatus(200);
            echo json_encode($json_array);
        } else {
            $app->response->setStatus(401);
        }
    });

    $app->post('/list', function () use ($app) {

        $json_array = array(
            array(
                'report_key' => 'key1',
                'customer_id' => 'customer1'
            ),
            array(
                'report_key' => 'key2',
                'customer_id' => 'customer2'
            )
        );

        $app->response->setStatus(200);
        echo json_encode($json_array);
    });

    $app->post('/detail/:report_key', function ($report_key) use ($app) {

        if ($report_key == 'key1') {
            $json_array = array(
                'report_key' => $report_key,
                'customer_id' => 'customer1',
                'report_contents' => 'key1-customer1-contents'
            );
        } else {
            $json_array = array(
                'report_key' => $report_key,
                'customer_id' => 'customer2',
                'report_contents' => 'key2-customer2-contents'
            );
        }

        $app->response->setStatus(200);
        echo json_encode($json_array);
    });

    $app->run();

## Slim3.0仕様のコード

で、Slim3.0で最低限動くようにしたコードがこれです。

    <?php
    require 'vendor/autoload.php';

    $app = new \Slim\App();

    $app->get('/', function () {
        echo "Index";
    });

    $app->get('/hello', function () {
        echo "Hello!";
    });

    $app->get('/hello/{name}', function ($request, $response, $args) {
        echo 'Hello, ' . $args['name'] . '!';
    });

    $app->get('/json', function () {
        $json_array = array(
            'name' => 'fumihiro fukuda',
            'company' => 'dalian spacekey'
        );

        echo json_encode($json_array);
    });

    $app->post('/post', function ($request, $response, $args) {
        $array = $request->getParsedBody();

        $json_array = array(
            'response_name' => $array['name'],
            'response_company' => $array["company"]
        );

        echo json_encode($json_array);
    });

    $app->post('/login', function ($request, $response, $args) {
        $array = $request->getParsedBody();

        $login_id = $array["login_id"];
        $login_pw = $array["login_pw"];

        if ($login_id == 'success') {
            $json_array = array(
                'user_name' => 'test name',
                'user_serial' => 'ABCDEFGH'
            );

            $response = $response->withStatus(200);

            $body = $response->getBody()->write(json_encode($json_array));
            //echo json_encode($json_array);
        } else {
            $response = $response->withStatus(302);
        }
        return $response;
    });

    $app->post('/list', function ($request, $response, $args) {

        $json_array = array(
            array(
                'report_key' => 'key1',
                'customer_id' => 'customer1'
            ),
            array(
                'report_key' => 'key2',
                'customer_id' => 'customer2'
            )
        );

        $response = $response->withStatus(200);
        $body = $response->getBody()->write(json_encode($json_array));

        return $response;
    });
    $app->post('/detail/{report_key}', function ($request, $response, $args) {

        if ($args['report_key'] == 'key1') {
            $json_array = array(
                'report_key' => $args['report_key'],
                'customer_id' => 'customer1',
                'report_contents' => 'key1-customer1-contents'
            );
        } else {
            $json_array = array(
                'report_key' => $args['report_key'],
                'customer_id' => 'customer2',
                'report_contents' => 'key2-customer2-contents'
            );
        }

        $response = $response->withStatus(200);
        $body = $response->getBody()->write(json_encode($json_array));

        return $response;
    });

    $app->run();

もしかしたらもうちょっと3.0に適した書き方があるのかもしれませんが、これで2.6と同じ動きをするようになってます。
一カ所コメントで、

    //echo json_encode($json_array);

となっているところは、$response->getBody()->writeじゃなくても、echoでも結果は同じです。

## 変更点

### new \Slim\App();

\Slim\Slim()って書いてたのが、\Slim\App()になっています。

### requestとresponse

use ($app)してから、$app->requestとして取得していたものを、パラメータでもらうように変わってます。

### URLから取るパラメータ

/hello/:name→ function($name)→ $nameという段取りで取得していたURLからのパラメータ指定方法が、{}書きに変わって、$argsから取得するように変わってます。

### JSON文字列からオブジェクトへのパース

bodyを取得してからjson_encodeをしていたものが、$request->getParsedBody()一発でできるようになってます。

### response

responseを何か操作したら、ちゃんと最後にreturnで戻さないとそのresponseが返りません。

### ステータスコード

$app->response->setStatus(401)としていたのですが、$response->withStatus(401)として、そのresponseを戻さないといけません。

## おわり

これだけ単純なコードでもいろいろ手を加えないといけないので、もっと作り込んでいるコードだとちょっと対応は大変ですね。
とはいえ、あえてSlimを選んで構築したサイトであれば、もともとフレームワーク自体シンプルに機能が絞られてるところから開発しているのでしょうし、現状で不満がないのであれば無理に3.0で作り替える必要もないのでしょう。
(まあ、composerでとれなくなったりするようであれば困りますけどね)