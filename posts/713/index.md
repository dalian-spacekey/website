---
layout: post
title: CentOS6.5でPandocの最新をインストール
date: 2014-11-30
tags: ["Document","Pandoc"]
---

[前回](http://spacekey.info/709/ "Pandocを活用して開発っぽくドキュメントを作成したい")書いたように、Markdownでドキュメントを書いてGitリポジトリにコミット、Jenkinsでhtmlに変換(そして見えるところにコピー)という段取りをしてみました。

JenkinsのサーバーはCentOS6.5で、Pandocのインストールはyumでさくっとやってみたんですが、バージョン1.9.4.1と、とても古いものでした。
とりあえずテキストをhtmlに変換してみたら一応それなりに動いていたので、これで行こうかと思っていたんですが、tableを書いたらなんかその部分だけhtmlに変換されないのです。
Windowsに入れた1.12.3だとちゃんとtableタグになるようなので、これはバージョンの問題かなぁと思って新しいのを入れてみることにしました。

こんな感じになります。

    wget http://sherkin.justhub.org/el6/RPMS/x86_64/justhub-release-2.0-4.0.el6.x86_64.rpm
    rpm -ivh justhub-release-2.0-4.0.el6.x86_64.rpm
    yum install haskell
    cabal update
    cabal --global install pandoc

ただ、このpandocのインストール部分は恐ろしいほど時間がかかります。
が、特に何か引っかかることもなくインストールは完了して、バージョンは1.13.1になり、無事tableが変換されるようになりました。

htmlへの変換も、力業のbashスクリプトを書いてmdファイルのディレクトリの中身を全部変換するようにして、Jenkinsのビルドで実行→変換結果をwebのディレクトリにコピーする、という段取りでビルド・デプロイという感じにしてみたら、なんかうまくいった感じです。

ローカルでの作業としては、mdファイルを編集して手元のpandocで変換を確認、大丈夫だったらcommit(push)という流れです。

なんかちょっと気持ちよくドキュメントが書けるような気がします。

&nbsp;