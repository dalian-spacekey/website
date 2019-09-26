---
title: "ASP.NET Core+AngularをKestrelで動かしたときに文字化けする"
date: "2018-07-30"
tags: ["CSharp","VisualStudio","ASP.NET Core", "Angular"]
---

Visual Studio 2017で、ASP.NET Core+Angularで作ったアプリケーションを、Kestrelで実行すると、コンソールの表示があれこれ文字化けします。

![console1.png](console1.png)

コンソールの文字コードの原因だと思われるので、Program.csのMainに、

```csharp
Console.OutputEncoding = System.Text.Encoding.UTF8;
```

こんな風にしておくと、

![console2.png](console2.png)

比較的ましな表示になります。
ただ、進捗表示部分はちょっとずつ右に寄っていきます。

まあ、常時見るものじゃないですし、最低限何かあったときに読めればいいぐらいですから、文字化けが気になるようなら、という備忘録として。