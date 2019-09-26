---
layout: post
title: CentOS6.5にPHP5.5+Slim Framework+PHPUnitの環境を作る その3
date: 2014-05-28
tags: ["PHP","SlimFramework"]
---

Slimを使ってアプリケーションが動かせるところまで来ました。
実際は、POSTだとかSession,Cookie,データベースなどもっと色々基本的な要素はありますが、その辺は順次やっていくとして、まずは環境周りから......ということで、次はPHPUnit+stagehand-testrunnerです。

#### PHPUnitのインストール

PHPUnitもComposerでインストールしてしまいます。
composer.jsonは下記の通りです。

    {
    　　　　"require": {
    　　　　　　　　"slim/slim": "2.*",
    　　　　　　　　"phpunit/phpunit": "4.1.*
    　　　　}
    }

phpunitの行を追加します。
slimの行の最後のカンマを忘れないように。
実際の開発では、"require"ではなく、"require-dev"で指定して「composer install --dev」として、開発用の環境と運用用の環境で分けたりするようですが、いまは練習中なのでとりあえずrequireで指定しておきます。
composer.jsonを書き換えたら、updateです。

    composer update

そうすると、関連したコンポーネントがずらずらっとインストールされます。
私の環境ではインストールの最後に下記のようなメッセージが出ました。

    phpunit/phpunit suggests installing phpunit/php-invoker (~1.1)

php-invokerというものをインストールしてねってことらしいですね。

    {
    　　　　"require": {
            "slim/slim": "2.*",
            "phpunit/phpunit": "4.1.*,
            "phpunit/php-invoker": "*"
    　　　　}
    }

composer.jsonに追加して、もう一回「composer update」でOKです。

#### PHPUnitが動くかどうかテスト

PHPのテストコードは慣習的にtestsディレクトリに入れるようなので、firstapp/testsディレクトリを作成します。
その中に、FirstTest.phpというファイルを作成して、中身を下記の通りにします。

    <?php
    Class FirstTest extends PHPUnit_Framework_TestCase
    {
        public function testPHPUnitRun()
        {
            $this->assertTrue(true);
        }
    }

その後、firstappディレクトリで

    vendor/bin/phpunit --tap tests

でテストを実行してみます。

    TAP version 13
    ok 1 - FirstTest::testPHPUnitRun
    1..1

という表示が出ればOKでしょう。
assertTrue(true)をassertTrue(false)にしてもう一回テスト実行すると、

    TAP version 13
    not ok 1 - Failure: FirstTest::testPHPUnitRun
      ---
      message: 'Failed asserting that false is true.'
      severity: fail
      ...
    1..1

と失敗するのがわかります。

#### stagehand-testrunner

ユニットテストをいちいちコマンドから実行するのではなく、ソースに変更があったらすぐに実行してくれるようにするツールです。
これもComposerからインストールです。

    {
    　　　　"require": {
            "slim/slim": "2.*",
            "phpunit/phpunit": "4.1.*,
            "phpunit/php-invoker": "*",
            "piece/stagehand-testrunner": "3.6.*"
    　　　　}
    }

こうなります。
うちの環境では、

    symfony/dependency-injection suggests installing symfony/proxy-manager-bridge (Generate service proxies to lazy load them)
    symfony/console suggests installing symfony/event-dispatcher ()

こんなんが出ました。
これなんですが、何も考えずにcomposer.jsonに追加したんですけど、さらに追加してくれって言うのが出てきて、大脱線劇が繰り広げられてしまうので今回は無視しました。
その後は、

    vendor/bin/testrunner compile -p vendor/autoload.php

まずこれを実行します。
いまいち意味がわかっていませんが、テスト実行する際の前準備として認識しています。
そして、

    vendor/bin/testrunner phpunit -p vendor/autoload.php -a tests

こうするとソースコードの変更を待ち受けてくれるようになります......んですが、なんかエラーをはきました。

    Warning: require_once(PHPUnit/Autoload.php): failed to open stream: No such file or directory in /var/www/html/secondapp/vendor/piece/stagehand-testrunner/src/Stagehand/TestRunner/Preparer/PHPUnitPreparer.php on line 40

    (以下コールスタックがだーっと)

要約するとPHPUnit/Autoload.phpがないぞってことなんですが、確かにそんなフォルダもファイルもないのです。
引っかかっているコードを見ると、

    namespace Stagehand\TestRunner\Preparer;

    require_once 'PHPUnit/Autoload.php';

    use Stagehand\TestRunner\CLI\Terminal;
    use Stagehand\TestRunner\DependencyInjection\PHPUnitConfigurationFactory;

確かに、なにかrequireしている。色々調べたんですがいまいちよくわからず、最後にgithubに何か情報はないかと、コードを確認してみると......

    namespace Stagehand\TestRunner\Preparer;

    if (!class_exists('PHPUnit_Runner_Version')) {
        require_once 'PHPUnit/Autoload.php';
    }

    use Stagehand\TestRunner\CLI\Terminal;
    use Stagehand\TestRunner\DependencyInjection\PHPUnitConfigurationFactory;

なんかコードがちょっと違う。
明確な意味はわからなかったけど、このif文の感じだとPHPUnitがロードなり初期化されていなかったらrequireするということなので、今の環境だったらすでに別のautoload.phpで全部お膳立てされているはずなので、PHPUnit/Autoload.phpを読み込む必要はないのでは？とか考えました。
で、このifブロックを移植してきて実行したら......

    PHPUnit 4.1.1 by Sebastian Bergmann.

    .

    First
     [x] P h p unit run

    Time: 85 ms, Memory: 7.00Mb

    OK (1 test, 1 assertion)

動きました。
この状態でFirstTest.phpを触ると、自動的にテストが実行されることがわかります。

とりあえず、初歩的な部分だけですがユニットテストが実行できて、それが自動的に走るようになりました。