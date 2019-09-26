---
layout: post
title: ASP.NET CoreのAPIサーバーでヘッダを確認する場合の注意事項
date: 2017-09-20
tags: ["NET Core","ReactNative"]
---

APIサーバーがASP.NET Core2.0、クライアントがReactNativeで作ったiOSアプリ(fetch)、メソッドを呼ぶ際にはヘッダに「X-HogeHoge-Key」などという感じのキーを指定する仕様、でどうしてもヘッダのキーが認識できない状況が発生。

postmanとかcurlとか別のものからの呼び出しは問題ないし、同じAPIサーバーとやりとりしているWebアプリは問題ない。

全く同じように書いたコードで、PHP(Slim Framework)で作った同じようなヘッダをセットするAPIのケースは問題ない(というかそこからコードを流用してきた)。

結局調べた結果、どうもReactNativeからfetchする際に、ヘッダが小文字化されてる？っぽく、サーバー側はcase sensitiveでキーを探しに行っていたためと判明。

こんな感じ。

```csharp
if (context.Request.Headers.Keys.Contains(keyName))
...
```

HTTPの仕様では、ヘッダの文字列はcase insensitiveらしいので、サーバー側でキーをチェックする際に、

```csharp
if (context.Request.Headers.Keys.Select(x => x.ToLower()).Contains(keyName.ToLower()))
...
````

こんな感じにしてやらないとだめでした。