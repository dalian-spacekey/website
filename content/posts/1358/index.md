---
layout: post
title: macのgitをHomebrewで2.8.0に更新
date: 2016-03-31
tags: ["Git","Mac"]
---

最近gitの2.8.0がリリースされましたので、作業環境のmacに入っているgitを更新することにしたんですが、3/31現在 [https://git-scm.com/](https://git-scm.com/) のダウンロードでは2.6.4が落ちてきます。

なので、Homebrewで更新してみました。

    $ brew install git

とりあえずこれでインストールされますが、以前本家サイトのインストーラーで入れたものが有効になっていて、

    $ git --version
    git version 2.6.2

ってことになってしまいますので、

    $ which git
    /usr/local/bin/git

で場所を確認して、

    $ ls -la /usr/local/bin ' grep git

とやると、git関連のコマンドが、/ust/local/git/binにリンクされてることがわかります。
Homebrewでインストールしたものは、/usr/local/Cellar/git/2.8.0にありますので、このリンクを張り替えてやればいいんですが、これもbrewでできます......が、すでにリンクが存在するとエラーになるようです。

    $ brew link git
    Linking /usr/local/Cellar/git/2.8.0...
    Error: Could not symlink bin/git
    Target /usr/local/bin/git
    already exists. You may want to remove it:
      rm '/usr/local/bin/git'

    To force the link and overwrite all conflicting files:
      brew link --overwrite git

    To list all files that would be deleted:
      brew link --overwrite --dry-run git

とりあえず強制的にリンクを上書きする、ってことで、

    $ brew link --overwrite git

として、やっと

    $ git --version
    git version 2.8.0

となりました。