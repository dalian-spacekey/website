---
layout: post
title: ScalatraでHello World
date: 2015-05-28
tags: ["Scala"]
---

CentOS 7でScalaのフレームワーク「Scalatra」ベースのHello Worldをやってみます。

### Java関連

    # java -version
    java version "1.7.0_79"
    OpenJDK Runtime Environment (rhel-2.5.5.1.el7_1-x86_64 u79-b14)
    OpenJDK 64-Bit Server VM (build 24.79-b02, mixed mode)

    # javac -version
    javac 1.7.0_79

### 大体の流れ

手順的には、 Conscriptをインストールして...... Conscriptをつかってgiter8をインストールして...... giter8を使ってScalatraのプロジェクトを作成して...... sbtを使ってビルド/起動して...... やっとHello Worldとなります。 なんかちょっと手順が複雑に感じますが、ポイントとしては、giter8が適切な設定済みのプロジェクトを落としてきてくれる、というところでそこさえクリアしてしまえば、あとはsbtコマンドで開発を進めるんですね。

### Conscriptのインストール

ConscriptはScalaのツールをインストールできるツールです。 giter8をインストールするために使います。

    # curl https://raw.githubusercontent.com/n8han/conscript/master/setup.sh ' sh

### giter8のインストール

Conscriptはcsというコマンドになっています。 回線の問題なのか何なのか、インストール完了まで結構時間がかかりました。

    # cs n8han/giter8

環境的な準備はこれで完了です。

### プロジェクトの作成

giter8は、GitHubにおかれているプロジェクトのテンプレートを取ってきて、それに設定をしてくれた上で、プロジェクトの実体を作ってくれるツールです。 Scalatraフレームワークのプロジェクトは、scalatra/scalatra-sbtを指定します。

    # g8 scalatra/scalatra-sbt
    organization [com.example]: info.spacekey
    name [My Scalatra Web App]: HelloScala
    version [0.1.0-SNAPSHOT]:
    servlet_name [MyScalatraServlet]:
    package [com.example.app]: info.spacekey.helloscala
    scala_version [2.11.6]:
    sbt_version [0.13.8]:
    scalatra_version [2.4.0.RC1]:

    Template applied in ./helloscala

必要な情報を入れると、直下にプロジェクト名のディレクトリができます。

### ビルドと起動

プロジェクトのディレクトリに移動して、

    # ./sbt

をすると、すでに設定されている必要なライブラリ等をインストールしてくれます。 ただ......初回はものすごい時間がかかります。 完了したら、プロンプトが> になっていますが、これはsbtのプロンプトです。 ここで、

    > container:start

とすると、ソースがコンパイルされて、Jettyを介してプログラムが起動します。 初期の設定では、localhost:8080で動くようになっていますので、ブラウザで表示するとHello, world!が出ます。

![000263](000263.png)

Jettyというのは知らなかったのですが、軽量なサーブレットコンテナ+HTTPサーバーです。何となく、Java絡みというとApache+Tomcatな、イメージが強かったのですがこう言うのもあるんですね。

とりあえず何にもコードを書いてませんが、Hello Worldは出ました。