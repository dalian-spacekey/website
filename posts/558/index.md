---
layout: post
title: コールバック地獄
date: 2013-11-19
tags: ["JavaScript"]
---

しばらく前から仕事でJavaScriptを触っている話は前に書いたかもしれませんが、最近node.jsとかでWebアプリケーションを書いてみたりしています。

実際にちゃんとしたアプリケーションを書くとなると結構色々処理が増えてくるわけで、例えばこういうコードになってしまったりします。

    User.getUserInfo({...}, function(err, userdata) {
        ...
        File.getFileList({...}, function(err, filelist) {
            ...
            mime(uploadfile, function(err, type) {
                ...
                easyimg.resize({...}, function(err, image) {
                    ...
                    File.add({...}, function(err) {
                        ...
                    }
                }
            }
        }
    }

えぐいですな......

何をしているのかというと、ユーザーの情報を取得して、それが所有するファイルの情報を取得して確認した上で、アップロードされてきたファイルのmimetypeを取得して、画像の処理をした上でそれを保存する、という画像を扱うシステムだとありがちな処理の流れだと思うんですが、非同期だとこういうことになってしまいます。

コールバック地獄が身に染みた事例です。
作りながらちょっとずつ機能を追加していくようなプログラミングをするともうドンドコネストが増えていきますね。