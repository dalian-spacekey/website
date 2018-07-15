---
layout: post
title: Visual Studio 2017(15.2)でXamarinのiOSプロジェクトがビルドできない問題2
date: 2017-05-15
tags: ["VisualStudio","Xamarin"]
---

[Visual Studio 2017(15.2)でXamarinのiOSプロジェクトがビルドできない問題](http://spacekey.info/1697/)のもうちょっと根本的な解決方法です。

## 方法

C:\Program Files (x86)\Microsoft Visual Studio\2017(Edition)\MSBuild\Xamarin\Xamarin.Apple.Sdk.targetsを管理者権限のあるエディタで開いて、最後の方にあるPropertyGroupタグの間に、

    <FrameworkPathOverride>$(TargetFrameworkRootPath)$(TargetFrameworkIdentifier)\$(TargetFrameworkVersion)</FrameworkPathOverride>

を追加します。

## 参考

[56213 - Cannot build iOS App (Can not resolve reference: C:/Windows/Microsoft.NET/Framework/v4.0.30319/de/mscorlib.resources.dll)](https://bugzilla.xamarin.com/show_bug.cgi?id=56213)

のcomment 24