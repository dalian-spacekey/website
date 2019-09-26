---
layout: post
title: ScalatraでHello World(Windows版)
date: 2015-05-28
tags: ["Scala"]
---

ScalatraでHello WorldのWindows版もやってみます。

手順は、CentOSの時と同じなんですが、インストール関連がWindows用になります。  

Windowsは64bitの8.1、Javaは7 update 79です。

### Conscriptのインストール

[GitHubのConscriptのページ](https://github.com/n8han/conscript)のInstallationに、conscript-0.4.4.jarのリンクがあるのでそれをダウンロードします。

    java -jar conscript-0.4.4.jar

でインストーラーが起動して、インストールしてくれます。(イラストが、なんか独特ですが......)  

インストール先は、ユーザーフォルダのbinになりますので、c:\users\username\binみたいなところになるはずです。  

ここにはPATHを通しておきます。

### giter8

CentOSの時と同じく、

    cs n8han/giter8

でOKです。

### sbt

sbtは手動でインストールしておく必要があります。  

[Installing sbt on Windows](http://www.scala-sbt.org/release/tutorial/Installing-sbt-on-Windows.html)からインストーラーをダウンロードしてインストールしておきます。

### プロジェクト作成

同じです。

    g8 scalatra/scalatra-sbt

### ビルドと起動

ディレクトリを移動してからsbtで大丈夫です。  

sbtのインストーラーがsbt.batと言うファイルを作ってくれています。  

もし、sbtがないとか言われたら、sbtのインストールフォルダ(C:\Program Files (x86)\sbt\bin)にパスが通っているか、また環境変数SBT_HOMEにそのフォルダが設定されているかの確認が必要でしょう。  

CentOS同様、結構時間がかかります。

起動もcontainer:startで同じ結果になります。

で、sbtのプロンプトが出ている状態で、

    browse

というコマンドを打つと、ブラウザでhttp://localhost:8080/が開いてくれます。便利ですね。

これでとりあえずWindowsでも動かしてみることができたので、Windows側で作って、Git経由してLinux環境で動作確認とかもできそうです。