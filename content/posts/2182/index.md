---
title: "C#でツイートする"
date: "2019-10-01 0:00:00"
tags: ["Csharp"]
---

C#でツイートする方法を調べてみました。

<!--more-->

ブログの更新ツイートは、IFTTTでRSSを監視して差分があったらツイートしてくれるようにしていたのですが、Azure Functionsがいい感じなので同じようなことが出来るようにしようと考えて、とりあえずC#でツイートするにはどうしたらいいか調べました。

## 調査結果

まず、nugetでCoreTweetを入れます。

コードを書きます。

```csharp
var tokens = Tokens.Create(
    "ConsumerKey",
    "ConsumerSecret",
    "AccessToken",
    "AccessSecret");

tokens.Statuses.Update("メッセージ");
```

以上。

まじか。

各種キーについては、[Developer](https://developer.twitter.com/)で開発者登録をして、からAppsを登録すると取得出来ます。
