---
layout: post
title: Visual Studio 2017(15.2)でXamarinのiOSプロジェクトがビルドできない問題
date: 2017-05-12
tags: ["VisualStudio","Xamarin"]
---

→[根本的な解決方法](http://spacekey.info/1741/)を追加しました。

## 概要

Visual Studio 2017が更新されバージョンが15.2になりましたが、このバージョンアップを行うと、XamarinのiOSプロジェクトがビルドでエラーになります。

エラーの要点は、

* mscorlib.dll
* mscorlib.resources.dll

の参照が解決できないというやつです。

Mac側でビルドする際に対象となるdllの各言語対応のものが送られてないのが原因のようです。

## 解決方法

エラーをよく確認すると、

    C:/WINDOWS/Microsoft.NET/Framework/v4.0.30319/ja/mscorlib.dll

とか、参照しに行こうとしているdllのパスがあるはずなので、まずWindows側でそのファイルを探します。そのあと、Mac側で、

    /Users/(user name)/Library/Caches/Xamarin/mtbs/builds/(project name)/(uuid)/C:/WINDOWS/Microsoft.NET/Framework/v4.0.30319/ja

に、Windowsからファイルをコピーしてやればビルドが通るようになります。

ディレクトリがない場合は作ってからファイルをコピーします。

## 雑記

WindowsのVisualStudioをバージョンアップする前に、Mac側にVisualStudio for Macをインストールしたり、Xamarin Studioをアンインストールしたりとごちゃごちゃしてたのでそのせいかと思っていろいろ試行錯誤してたんですが、Windows版のXamarinの問題だったようです。

## 参考

[56213 - Cannot build iOS App (Can not resolve reference: C:/Windows/Microsoft.NET/Framework/v4.0.30319/de/mscorlib.resources.dll)](https://bugzilla.xamarin.com/show_bug.cgi?id=56213)

のcomment 12