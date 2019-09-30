---
title: "[AzureFunctions]指定されたURLを読んでmetaタグの一部を取得する"
date: "2019-09-29 0:00:00"
tags: ["Azure", "C#"]
---

Azure FunctionsはHello World的なところで止まっていたので、HUGOの方で必要になったものを作ってみました。

<!--more-->

{{<linkcard "https://spacekey.info/posts/2180/">}}


ここで解説している、リンク先のページからmetaデータをとってきてjsonで返してくれるAPIです。

## 対応内容

1. Visual StudioでAzure Functionsのプロジェクトを作る
2. nugetでAngleSharpを入れる
1. 受け取ったURLにアクセスして、必要なmetaタグのデータを取得できるようにする
2. jsonにして返す
3. Azure Functionにデプロイして外から使えるようにする

対象となるURLからmetaタグを取得するには、AngleSharpが非常に便利そうだと言うことでnugetからいれます。そしてVisual StudioでAzure Functionsプロジェクトを作ると、最初にひな形が入っているので、それを書きかえて使います。

```csharp
[FunctionName("SocialMetadata")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
    ILogger log)
{
    string url = req.Query["url"];

    log.LogInformation($"URL : { url }");

    try
    {
        var context = BrowsingContext.New(Configuration.Default.WithDefaultLoader());
        var document = await context.OpenAsync(url);

        var json = new
        {
            url,
            title = document.QuerySelector("title")?.TextContent,
            ogTitle = document.QuerySelector("meta[property='og:title']")?.GetAttribute("content"),
            ogImage = document.QuerySelector("meta[property='og:image']")?.GetAttribute("content"),
            ogDescription = document.QuerySelector("meta[property='og:description']")?.GetAttribute("content"),
            ogType = document.QuerySelector("meta[property='og:type']")?.GetAttribute("content"),
            ogUrl = document.QuerySelector("meta[property='og:url']")?.GetAttribute("content"),
            ogSiteName = document.QuerySelector("meta[property='og:site_name']")?.GetAttribute("content")
        };

        return new OkObjectResult(json);
    }
    catch (Exception ex)
    {
        log.LogError(ex.Message);
        return new InternalServerErrorResult();
    }
}
```

この程度です。  
ローカルでも普通に動くので、デバッグ実行してブラウザでもcurlでもpostmanでも使って実際に呼んでみて、問題なさそうか確認しておきます。

```json
{
    "url": "https://spacekey.info/posts/2176/",
    "title": "[HUGO]OGPのtitleとdescriptionタグを動的に出力する | SPACEKEY",
    "ogTitle": "[HUGO]OGPのtitleとdescriptionタグを動的に出力する",
    "ogImage": "https://spacekey.info/img/logo_icon_128.png",
    "ogDescription": "新しい投稿をtweetするようにしてあるのですが、OGPタグの設定が中途半端で残念な感じになったので対応していきます。\n\n",
    "ogType": null,
    "ogUrl": "https://spacekey.info/posts/2176/",
    "ogSiteName": "SPACEKEY"
}
```

こんな結果が返ってきます。

なんかエラーになった場合500エラーを返すしかしてませんが、そもそもサイトの記事を書いてるときか、productionビルドされるときしか呼ばれないので、なんか出たら自分でわかる程度の対処でいいです。

あとは、Visual StudioのプロジェクトをAzureに向けて発行したらキーが付いたURLができますので、それを使ってパラメータにurlを渡すだけです。

```
https://hogehoge.azurewebsites.net/api/SocialMetadata?code=(長い文字の羅列)))?url=https://spacekey.info/posts/2176/
```

こんな感じ。

すごく簡単でかつ便利です。  
作業中にちょっとコンソールアプリケーションのプロジェクト作ってコードを書いて確認することがありますが、もうほぼそれの延長でAzureにpublishするだけのノリで出来てます(中身はAngleSharpの使い方を試してみたほぼそのまま)。

外に置く、となると昔はなんか色々手間がかかりましたけど、サーバーレスっていうものの利点が活きた事例でした。