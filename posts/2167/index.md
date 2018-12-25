---
title: "ASP.NET CoreでMessagePackやUtf8Jsonを使う"
date: "2018-12-25"
tags: ["ASP.NET Core"]
---

さて、Xamarin.FormsとMessagePackでやりとりできることは確認できたので、ASP.NET Coreのサーバー側の整理をしておきます。

## MessagePackで返すようにしてみる

[neuecc/MessagePack-CSharp](https://github.com/neuecc/MessagePack-CSharp)

本体はもちろん入れておくとして、あとは説明通りMessagePack.AspNetCoreMvcFormatterを入れて、ConfigureServicesがこんな感じになります。

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc()
        .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
        .AddMvcOptions(option =>
        {
            option.OutputFormatters.Clear();
            option.OutputFormatters.Add(new MessagePackOutputFormatter(StandardResolver.Instance));
            option.InputFormatters.Clear();
            option.InputFormatters.Add(new MessagePackInputFormatter(StandardResolver.Instance));
        });
}
```

これだけ。

あとは、

```csharp
[HttpGet]
public IActionResult Get()
{
    return new ObjectResult(list);
}
```

普通にオブジェクトを返してあげるだけ。

## Utf8Jsonで返すようにしてみる

[neuecc/Utf8Json](https://github.com/neuecc/Utf8Json)

Utf8Jsonもneueccさんが書いた、速いJSONシリアライザです。  
Utf8Json.AspNetCoreMvcFormatterを入れておいて、あとはMessagePackの時と同じパターン。

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc()
        .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
        .AddMvcOptions(option =>
        {
            option.OutputFormatters.Clear();
            option.OutputFormatters.Add(new  Utf8Json.AspNetCoreMvcFormatter.JsonOutputFormatter(StandardResolver.Default));
            option.InputFormatters.Clear();
            option.InputFormatters.Add(new  Utf8Json.AspNetCoreMvcFormatter.JsonInputFormatter());
        });
}
```

簡単です。  
※Microsoft.AspNetCore.Mvc.Formatters.JsonOutputFormatterと間違えないように。

## 組み合わせる

MessagePackはいいんですけど、ちょっと中身覗いてみたりするのがJSONよりは不便だったり、swaggerを使ってるとかでJSON扱えるとテスト呼び出しがしやすかったり、クライアント側がそもそもJSONしか対応してない奴がいる、とかだとどうしてもJSONじゃないと困るケースはあるでしょうし、動いてるシステムでいきなりばっくり差し替えるなんて荒技はさすがにいけてなかったりしますので、Acceptヘッダに応じて返す形式が変われば幅が広がります。

まずは、JSONについてはASP.NET Coreのデフォルトのままにしておいて、MessagePackを追加、Acceptヘッダがapplication/x-msgpackの時は、MessagePackで返すようにしてみます。

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc()
        .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
        .AddMvcOptions(option =>
        {
            option.OutputFormatters.Add(new MessagePackOutputFormatter(StandardResolver.Instance));
            option.InputFormatters.Add(new MessagePackInputFormatter(StandardResolver.Instance));
        });
}
```

ClearしてMessagePackのフォーマッタだけ登録してあったのを、追加するようにしてます。PostmanなりでAcceptヘッダを切り替えて呼ぶと、それぞれの形式で結果を返してくれるのがわかります。

じゃあ、JSONのフォーマッタをUtf8Jsonに差し替えてみましょう。これで、どっちが来ても最速設定にできます。  
デフォルトのOutputFormatterは下記のように入ってます。

* Microsoft.AspNetCore.Mvc.Formatters.HttpNoContentOutputFormatter
* Microsoft.AspNetCore.Mvc.Formatters.StringOutputFormatter
* Microsoft.AspNetCore.Mvc.Formatters.StreamOutputFormatter
* Microsoft.AspNetCore.Mvc.Formatters.JsonOutputFormatter

最後のJsonのやつを削除して、Utf8Jsonのフォーマッタに入れ替えてあげます。

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc()
        .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
        .AddMvcOptions(option =>
        {
            option.OutputFormatters.RemoveType<Microsoft.AspNetCore.Mvc.Formatters.JsonOutputFormatter>();
            option.OutputFormatters.Add(new Utf8Json.AspNetCoreMvcFormatter.JsonOutputFormatter());
            option.OutputFormatters.Add(new MessagePackOutputFormatter(StandardResolver.Instance));
        });
}
```

こんな感じにすると、OutputFormattersがこんな感じになります。

* Microsoft.AspNetCore.Mvc.Formatters.HttpNoContentOutputFormatter
* Microsoft.AspNetCore.Mvc.Formatters.StringOutputFormatter
* Microsoft.AspNetCore.Mvc.Formatters.StreamOutputFormatter
* Utf8Json.AspNetCoreMvcFormatter.JsonOutputFormatter
* MessagePack.AspNetCoreMvcFormatter.MessagePackOutputFormatter

さて、これで呼び出してみますとJSONは返ってきます。  
が、Accept:application/x-msgpackでもJSONが返ってきます。  

っていうか、これちょうど1年ぐらい前に同じこと試していたのを思い出しました。結局他のことに忙しくなって放置してたやつでした。

## 答え

結局、何で切り替わってくれないのかというと、

* [MessagePack.AspNetCoreMvcFormatter/Formatter.cs](https://github.com/neuecc/MessagePack-CSharp/blob/master/src/MessagePack.AspNetCoreMvcFormatter/Formatter.cs)
* [Utf8Json.AspNetCoreMvcFormatter/Formatter.cs](https://github.com/neuecc/Utf8Json/blob/master/src/Utf8Json.AspNetCoreMvcFormatter/Formatter.cs)

のそれぞれにあるCanWriteResultがこうなってるからですね。

```csharp
public bool CanWriteResult(OutputFormatterCanWriteContext context)
{
    return true;
}
```

仕組みとしては、OutputFormatterに順番に問い合わせて、trueが返ってきたやつで処理されるってことですね。ちなみにUtf8JsonとMessagePackの登録順を入れ替えると結果がひっくり返るのでこれで間違いなさそうです。

※もしかしてこれを固定にしているのはもしかして、Formatterを1個に絞ってしまってさっさと処理してしまった方が速いから、とかそういう意図があるのかな？

なので、それぞれのコードを参考にして、ContentTypeを比較するようにしたものを作ってしまいます。

```csharp
public class Utf8JsonOutputFormatter : IOutputFormatter
{
    private const string ContentType = "application/json";
    private readonly IJsonFormatterResolver resolver;

    public Utf8JsonOutputFormatter() : this(null) {}

    public Utf8JsonOutputFormatter(IJsonFormatterResolver resolver)
    {
        this.resolver = resolver ?? JsonSerializer.DefaultResolver;
    }

    public bool CanWriteResult(OutputFormatterCanWriteContext context)
    {
        return context.ContentType == ContentType;
    }

    public Task WriteAsync(OutputFormatterWriteContext context)
    {
        context.HttpContext.Response.ContentType = ContentType;

        if (context.ObjectType == typeof(object))
            return JsonSerializer.NonGeneric.SerializeAsync(context.HttpContext.Response.Body, context.Object, resolver);
        else
            return JsonSerializer.NonGeneric.SerializeAsync(context.ObjectType, context.HttpContext.Response.Body, context.Object, resolver);
    }
}
```

```csharp
public class MessagePackOutputFormatter : IOutputFormatter
{
    private const string ContentType = "application/x-msgpack";
    private readonly IFormatterResolver resolver;

    public MessagePackOutputFormatter(IFormatterResolver resolver)
    {
        this.resolver = resolver ?? MessagePackSerializer.DefaultResolver;
    }

    public bool CanWriteResult(OutputFormatterCanWriteContext context)
    {
        return context.ContentType == ContentType;
    }

    public Task WriteAsync(OutputFormatterWriteContext context)
    {
        context.HttpContext.Response.ContentType = ContentType;

        if (context.ObjectType == typeof(object))
        {
            if (context.Object == null)
            {
                context.HttpContext.Response.Body.WriteByte(MessagePackCode.Nil);
                return Task.CompletedTask;
            }
            else
            {
                MessagePackSerializer.NonGeneric.Serialize(context.Object.GetType(), context.HttpContext.Response.Body, context.Object, resolver);
                return Task.CompletedTask;
            }
        }
        else
        {
            MessagePackSerializer.NonGeneric.Serialize(context.ObjectType, context.HttpContext.Response.Body, context.Object, resolver);
            return Task.CompletedTask;
        }
    }
}
```

この自作のやつを登録すると、ちゃんと切り替わってくれるようになります。  
これでどっちで来ても最速。

## LZ4対応

さて、あとはLZ4対応ですが、これもさっき作ったやつをLZ4MessagePackSerializerを使うようにするだけ。

```csharp
public class LZ4MessagePackOutputFormatter : IOutputFormatter
{
    private const string ContentType = "application/x-msgpack";
    private readonly IFormatterResolver resolver;

    public MessagePackOutputFormatter(IFormatterResolver resolver)
    {
        this.resolver = resolver ?? MessagePackSerializer.DefaultResolver;
    }

    public bool CanWriteResult(OutputFormatterCanWriteContext context)
    {
        return context.ContentType == ContentType;
    }

    public Task WriteAsync(OutputFormatterWriteContext context)
    {
        context.HttpContext.Response.ContentType = ContentType;

        if (context.ObjectType == typeof(object))
        {
            if (context.Object == null)
            {
                context.HttpContext.Response.Body.WriteByte(MessagePackCode.Nil);
                return Task.CompletedTask;
            }
            else
            {
                LZ4MessagePackSerializer.NonGeneric.Serialize(context.Object.GetType(), context.HttpContext.Response.Body, context.Object, resolver);
                return Task.CompletedTask;
            }
        }
        else
        {
            LZ4MessagePackSerializer.NonGeneric.Serialize(context.ObjectType, context.HttpContext.Response.Body, context.Object, resolver);
            return Task.CompletedTask;
        }
    }
}
```

もちろんですが、非圧縮のものと混ぜると先に登録した方になっちゃうのでどっちかにするか、ContentTypeを別なものにするかです。

## まとめ

なんとなくやっつけ感が否めませんが、一応それぞれ最速を謳われる2つのシリアライザで併用してみるってことができました。

速度や効率は気にしない、できるだけ一般的で無難なやり方を、ということなら、こういう手の入れ方はあんまり適してないとは思います。作業が完了すると手を離れていくようなコード書きの場合はあんまり使われてない方法をとりづらいですからね。

とはいえ、やっぱりいろいろ試行錯誤しながらうまくいって、その結果効率が上がるのであればやってみたくなりますね。誰もそれを目にすることはないかもしれないけど、「実はこのシステム、こんな技使ってるねんでー」という密かなプログラマの自己満足が満たせます。