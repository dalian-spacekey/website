---
title: "ASP.NET Coreで400系のレスポンスを返すと、bodyにエラーの詳細が出る"
date: "2019-06-19"
tags: ["ASP.NET Core"]
---

ASP.NET Core 3.0でAPIサーバーを作ってPostmanでチェックしようとしたら、明示的に「NotFoundResult()」を返したりするケースで、Response Bodyにエラーの詳細が記載されているJSONが返ってくるのに気がつきました。  
これまでbodyには何も返らない前提でやっていたので、なんか気になって調べてみましたら、

```csharp
services.Configure<ApiBehaviorOptions>(options => 
{
    options.SuppressMapClientErrors = true; 
});
```

これで表示を抑制できるとのこと。  
今までこんな設定してなかったのになぁ、と思ったら、

[ApiBehaviorOptions.SuppressMapClientErrors Property](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.apibehavioroptions.suppressmapclienterrors?view=aspnetcore-2.2)

```
The default value is true if the version is Version_2_2 or later; false otherwise.
```

ということらしいです。