---
layout: post
title: CentOS6.5にPHP5.5+Slim Framework+PHPUnitの環境を作る その4
date: 2014-05-28
tags: ["PHP","SlimFramework"]
---

PHP,Slim,PHPUnitと来ましたので次は、[Selenium](http://docs.seleniumhq.org/)です。
ブラウザ上の動きをテストするやつですね。ここまで使いこなせるかどうかで開発の効率もだいぶ変わってくると思います。

#### firefoxにSelenium IDEプラグインをインストール

CentOSのイメージからVMWareに環境を作ると標準でfirefoxが入っているので、そのfirefoxでSeleniumのダウンロードページから「Selenium IDE」をダウンロードすれば、勝手に入ります。

あと、今後のために「[PHP Formatter](https://addons.mozilla.org/ja/firefox/addon/selenium-ide-php-formatters/)」も入れておきます。
これは、firefoxのSelenium IDEで作成したテストをPHPの形式で出力できるようにするものです。
さすがに全部手で書くというのも大変なので、こう言うのがあった方がいいでしょう。

次に、Seleniumでのテストを自動実行するための準備です。

#### Selenium ServerとXvfbのインストール

ブラウザを自動で実行してくれるものです。

[http://docs.seleniumhq.org/download/](http://docs.seleniumhq.org/download/)
ここからselenium-server-standalone-2.42.0.jarをダウンロードしたあと、そいつをどこかに適切な場所においといてください。あと拡張子を見てわかる通り、javaなのでyum install java-1.7.0-openjdkとかでjavaが動くようにしておいてください。

あとは、Xvfb(X Virtual Frame Buffer)というものも、yum install xorg-x11-server-Xvfbでインストールします。
これが用意してくれた仮想フレームバッファ内でfirefoxを動かすことにより、画面上でがっちゃんがっちゃんしているのを見なくて良くなります。

それぞれコンソールでいちいち起動するのは、コマンドや場所を忘れたりしてとにかくめんどくさいので、下記を全面的に参考にさせてもらってサービスとして扱えるようにします。
[https://github.com/kohkimakimoto/chef-cookbooks-selenium](https://github.com/kohkimakimoto/chef-cookbooks-selenium)
もう、ほんとに助かります。
自分でこんなことやろうと思ったらいつ開発が始められるのか......
これで、service selenium startとかservice xvfb startとかできるようになります。

#### Composerでphpunit-seleniumをインストール

プロジェクトフォルダのcomposer.jsonに

    "phpunit/phpunit-selenium": ">=1.3.1"

こんな感じのものを追加して、updateしておきます。

下準備はこれで完了です。

#### テストを実行してみる

/firstapp/tests/webTest.phpと言うファイルを用意して、下記のようにします。

    <?php
    class WebTest extends PHPUnit_Extensions_SeleniumTestCase
    {
        protected function setUp()
        {
            $this->setBrowser('*firefox');
            $this->setBrowserUrl('http://localhost/firstapp/');
        }

        public function testTitle()
        {
    　　　　　　　　$this->open('http://localhost/firstapp/');
            　　$this->assertTitle('FirstApp');
        }
    }

次に、index.phpの/の部分をこういう感じにしましょう。
titleが出るようにしておきます。

    $app->get('/', function () {
        echo "<html><head><title>FirstApp</title></head><body><h1>Hello world!</h1></body></html>";
    });

これであとは、vendor/bin/phpunit --tap testsすると

    TAP version 13
    ok 1 - FirstTest::testPHPUnitRun
    ok 2 - WebTest::testTitle
    1..2

という表示がされて、PHPUnit-Seleniumの連動でテストされることがわかります。
これでいちいちブラウザを立ち上げて何か操作をして動作を確認するという作業から解放されますね。
UIはなかなかテストファーストって言うわけにも行かないと思いますので、まずは普通にfirefoxで確認してそれをSelenium IDEで記録しながらテストコードのベースを作って、それに手を入れていくというのがいい方法じゃないでしょうかね。