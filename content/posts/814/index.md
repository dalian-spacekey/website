---
layout: post
title: VMWare+Windows10 TechnicalPreviewで「準備しています」が終わらない
date: 2015-02-02
tags: ["Windows"]
---

先日、Windows10のTechnicalPreview ビルド9926が公開され、日本語にも標準で対応したということなのでダウンロードして、まずはVMWareに環境を作ってみようとしたんですが......

インストールの途中で、デバイスのセットアップが行われたあと、「準備しています」というメッセージが出たまま延々と待機状態になってしまいました。2,3回トライしてみたのですが、結果は一緒で1時間以上放置しても先に進みませんでした。

これは、VMWareで仮想マシンを作るときにコアの数を2以上にすれば早く終わりました(デフォルトだと1個になっていた)。