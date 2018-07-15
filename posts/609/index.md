---
layout: post
title: node.jsのアプリケーションの実行ユーザーを変更
date: 2013-12-11
tags: ["JavaScript","node.js"]
---

node.jsでアプリケーションを作って運用する場合で、かつリバースプロキシなどを使わず直接特権ポートで待ち受けたい場合は、rootで実行します。

が、万が一何かクラック的な行為を受けた場合root権限では危険なこともあるので、待ち受けが開始された直後に高度な権限のないユーザーに変更しておくのがよいでしょう。

まずは、実行用のユーザーを作成します。

    groupadd node
     useradd -g node --no-create-home --shell /sbin/nologin node

とすると、nodeグループのnodeユーザーができます。

そのあと、スクリプトのサーバーを起動しているところを変更します。

    http.createServer(app).listen(app.get('port'), function(){
        process.setuid('node');
        console.log('listening on port ' + app.get('port'));
    });

これだけです。
実際にnode.jsのアプリケーションを起動して、ps -ef ' grep nodeで見てみると、ちゃんとnodeユーザーで起動されているのがわかります。
これで万が一乗っ取られてもroot権限では何かできませんので安心です。

ただし、アプリケーション内部でサーバー起動後に何かファイルやディレクトリを操作したり等、権限が絡むようなコードがある場合は関連するものに権限を与えておく必要がありますので注意が必要です。