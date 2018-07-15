---
layout: post
title: Windows 8.1 でVMwareとHyper-Vを共存
date: 2014-05-20
tags: ["Windows"]
---

OSをWindows 7からWindows8.1に変更しました。

Windows 8も、8→8.1→8.1 Updateとなり、だいぶこなれてきたのと、使い勝手も徐々に元のWindowsに回帰してきた感じだったので、そろそろいいんじゃないかと思いまして。

とはいうものの、Windows 7じゃないと困ることもあったり、色々インストールしてみたり、テストしたりする環境があれば、ベースのOSを汚すことも減るので、VMware Player+NHMを併用することにしています。当初Hyper-Vでもいいかなと思ったんですが、なにかと痒いところに手が届かないので......

で、機嫌良く環境構築を進めていたのですが、最近携帯をWindows Phoneに変えたらその辺の開発関連もどうなってるのか気になってしまったのでV、isual Studio Express 2013 for Windowsを入れたらエミュレータの動作のためにHyper-Vを有効にしないといけなくなったのですね。

そしたら何が起きたかというと、Hyper-Vが有効な場合はVMwareが起動できなくなりました。
めんどくさい......

何か共存する手段はないかと探していたのですが、結局はVMwareを使う場合はHyper-Vを無効にするという手段しかありませんでした。下記の方法がエレガントな感じだったのでやってみました。

Windows 8 でHyper-V とVMware Workstation を使い分ける方法([ＰＣプチ技能向上委員会？](http://enjoypcblog.blog32.fc2.com/))
http://enjoypcblog.blog32.fc2.com/blog-entry-690.html

ブート時にHyper-Vを起動するかを決める感じになります。
bcdeditコマンドをbatファイルで動かすというシンプルな方法もありましたが、結局再起動が必要なのでこの方がわかりやすいかなと思いました。