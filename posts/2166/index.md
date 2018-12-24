---
title: "Xamarin.FormsでMessagePackを使う"
date: "2018-12-24"
tags: ["Xamarin"]
---

Xamarin.FormsでMessagePackを使ってみます。

[neuecc/MessagePack-CSharp](https://github.com/neuecc/MessagePack-CSharp)

ごくごく普通のアプリを作るのであれば、まあ大体どこでもやってるjsonでやりとりして、どこでも使ってるJson.NETでserialize/deserializeしておくのが無難です。  
が、なんかちょっとでも速度が必要だとか、効率のよいデータのやりとりを、となったときの選択肢としてお勉強しておくのは大事なことです。

まあ「シリアライザが高速」であっても、結局そこ以外の部分がしょぼくて非効率だとそんなに意味ないよね、ということはあるとはいえ、MessagePackの場合はなにも気にせず普通に置き換えるだけでも、jsonよりはずっとデータのサイズが小さくなりますし、さらにLZ4圧縮を使うことで速度は大して変わらずサイズが激減できる可能性がありますから、効果のほどがわかりやすい手段だと思います。

## 環境

* Visual Studio 2017 15.9.4
* Xamarin.Forms 3.4.0.1008975
* Prism.Unity.Forms 7.1.0.431
* ReactiveProperty 5.3.2
* MessageePack 1.7.3.4

ベースになってるプロジェクトはPrism Blank Appで、Xamarin.FormsやPrism.Unityはnugetでアップデートしています。その後、nugetでMessagePackをインストールします。

あと、Xamarinの場合、MessagePackUniversalCodeGenerator(mpc.exe)が必要になります。  
[https://github.com/neuecc/MessagePack-CSharp/releases](https://github.com/neuecc/MessagePack-CSharp/releases)にzipがあるので、それをダウンロードして、どっかpathの通ったところにおいときます。

(ちなみに、今書いてる時点でGitHubではver1.7.3.5がリリースされてるんですが、nugetはまだ1.7.3.4です)

## User

MessagePackの基本的な使い方に従って、やりとりするデータのクラスにはMessagePackObject属性と、各フィールドにKey属性をつけています。

```csharp
[MessagePackObject]
public class User
{
    [Key(0)]
    public int Id { get; set; }
    [Key(1)]
    public string Name { get; set; }
    [Key(2)]
    public string Description { get; set; }
}
```

で、これを書いた時点で、mpc.exeを使ってformatterのコードを生成してやる必要があります。  
.NET環境で実行するものであれば動的に行われているので必要ありませんが、Xamarinの環境では実行時は.NET環境ではなくiOSやAndroidなどそれぞれの環境ですから、formatterの動的生成が行われません。事前にコードを生成しておく必要があります。

コマンドプロンプトなりで共有プロジェクトのフォルダまで行って下記を実行します。

```plain
mpc.exe -i BlankApp17.csproj -o MessagePackGenerated.cs
```

エラーなどがでなければ、共有プロジェクトのルートにMessagePackGenerated.csというファイルが自動で追加されます。  
ここに入っているコードが、Userをバイナリにしたり戻したりしてくれます。コードを一通り眺めてみると、Keyが0だったらどう変換するとか言う部分があります。

ちなみに、出力されるファイル名は-oパラメータで変更できますし、フォルダ名を指定することでちゃんとプロジェクトのフォルダの中に入ってくれます。

で、クラスの内容を変更したり、新しいクラスを追加したりすると当然このコードも変更されないといけませんので、そのたびにmpc.exeを実行する必要があります。  
面倒だし、忘れてバグる可能性大なので、ビルド前イベントに、

```plain
mpc.exe -i $(ProjectPath) -o $(ProjectDir)MessagePackGenerated.cs
```

とかしておくとビルドの度に勝手にやってくれるのでいいでしょう。

## App.xaml.cs

さて、上記でできたコードは勝手に使ってくれませんので、アプリケーション開始時に使えるようにしておく必要があります。
App.xaml.csのOnInitializedに、指示されてる通りのCompositeResoverの登録をしておきます。

```csharp
protected override async void OnInitialized()
{
    InitializeComponent();

    CompositeResolver.RegisterAndSetAsDefault(
        GeneratedResolver.Instance,
        DynamicGenericResolver.Instance,
        BuiltinResolver.Instance,
        AttributeFormatterResolver.Instance,
        PrimitiveObjectResolver.Instance);

    await NavigationService.NavigateAsync("NavigationPage/MainPage");
}
```

説明のコードに加えて、DynamicGenericResolverを追加してあります。  
これはListとかDictionary、配列なんかの面倒を見てくれるものなので、一覧で何かを取得するようなAPIを呼ぶときに必要になります。

## MainPageViewModel

ボタンをタップすると、APIを呼んでMessagePackでシリアライズされた、Userの一覧を取得してオブジェクトに戻します。  
MessagePackの動作だけ確認したいので、データはデバッグ出力するだけです。

```csharp
public class MainPageViewModel : ViewModelBase
{
    public MainPageViewModel(INavigationService navigationService) : base(navigationService)
    {
        GetCommand = new ReactiveCommand();
        GetCommand.Subscribe(async _ =>
        {
            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Accept", "application/x-msgpack");

            var response = await httpClient.GetAsync("http://.../api/values");
            var data = await response.Content.ReadAsByteArrayAsync();
            var result =  MessagePackSerializer.Deserialize<User[]>(data);

            foreach(var item in result)
                Console.WriteLine($"{item.Id}:{item.Name}:{item.Description.Substring(0, 30)}");
        });
    }

    public ReactiveCommand GetCommand { get; }
}
```

## 実行

サーバー側はASP.NETであらかじめ作ったMessagePackでUserの一覧を返すだけのものが動いてます。

```plain
1:aaaaa:Lorem ipsum dolor sit amet, co
2:bbbbb:Etiam feugiat eros eu dapibus
3:ccccc:Lorem ipsum dolor sit amet, co
4:ddddd:Donec efficitur libero non int
5:eeeee:Nulla orci felis, sodales vel
6:fffff:Ut tempus faucibus sapien, ac
7:ggggg:Vestibulum faucibus scelerisqu
8:hhhhh:Curabitur et risus augue. Aliq
9:iiiii:Etiam ultricies feugiat massa.
```

とれました。

ちなみに、Descriptionにはちょっとだけ長い文章が仕込んであって、jsonの場合はPostmanでコールしたときは全体で5.26KB、MessagePackだと4.99KBになります。

若干の手間はかかりますが、最初に仕込んでおけばjson使うときとほとんど変わりません。  
多分開発段階で出てくるデメリットとしては、jsonだとデータがどんなことになってるのかはテキスト出力してみればわかりますが、MessagePackだとデータがバイナリで来るため、

![binary](binary.png)

こんなことになるのが不便ですかね。  
Keyを数字ではなく、フィールド名にすることもできますからそれでもうちょっと見やすくできますが、せっかくコンパクトに速くできるのにそこを妥協してしまうぐらいだったら、もうjsonでいいじゃんという気もします。  
サーバー側を工夫して、Acceptでjsonを指定するとjsonで受け取れるようにしておくというのも手かもしれません。

## LZ4圧縮してみる

さて、データを小さくしてみましょう。  
説明見る限り、ここまでのことができていたらいろいろ考えることなく、LZ4MessagePackSerializerを使えば解決！と行きたいのですが、ちょっとはまりました。

まず、サーバー側をLZ4で出力するようにして、Postmanでみると2.94KBになってるのを確認しました。

で、MainPageViewModelのDeserializeするところを、LZ4MessagePackSerializerに変更します。

```csharp
var result =  LZ4MessagePackSerializer.Deserialize<List<User>>(data);
```

ところがこれで実行すると例外が出ます。

```plain
System.TypeInitializationException: The type initializer for 'MessagePack.Resolvers.StandardResolver' threw an exception.
```

なんかResolverが必要なのかと試行錯誤してみましたがどうも違うようで、MessagePackのコードを追いかけてみると、LZ4MessagePackSerializerのSerializeでは、resolverの指定がない場合、MessagePackSerializer.DefaultResolverを使うことになってます。

```csharp
/// <summary>
/// Serialize to binary with specified resolver.
/// </summary>
public static byte[] Serialize<T>(T obj, IFormatterResolver resolver)
{
    if (resolver == null) resolver = MessagePackSerializer.DefaultResolver;
```

MessagePackSerializer.DefaultResolverは、CompositeResolver.RegisterAndSetAsDefaultで登録されたものが入ってくることになってるんですが、MessagePackSerialize.DefaultResolverを覗いてみるとStandardResolverの例外になってる。何の例外かはわからないんですが、とりあえずLZ4でSerizlizeするときにResolverがとれてないから動かない、ということはわかりました。

ということは、Resolverをそのまま指定してあげれば動くはず。

```csharp
var result =  LZ4MessagePackSerializer.Deserialize<List<User>>(data, CompositeResolver.Instance);
```

うごきました。

```plain
1:aaaaa:Lorem ipsum dolor sit amet, co
2:bbbbb:Etiam feugiat eros eu dapibus
3:ccccc:Lorem ipsum dolor sit amet, co
4:ddddd:Donec efficitur libero non int
5:eeeee:Nulla orci felis, sodales vel
6:fffff:Ut tempus faucibus sapien, ac
7:ggggg:Vestibulum faucibus scelerisqu
8:hhhhh:Curabitur et risus augue. Aliq
9:iiiii:Etiam ultricies feugiat massa.
```

StandardResolverの問題は、ちょっとコード追いかけてみたけどよくわからないのであきらめました。

## まとめ

さすがに実際の手触りを考慮して作られているだけあって、jsonを扱うのと大差ない使い心地で使えます。  
しかも速いし、小さくもできる、となると、サーバー側も対応できて、クライアント側の多様性を考慮しなくていいのであれば、jsonから置き換えてしまっても特に不都合はなさそうに思えます。  
圧縮効果の高いデータを扱っているのであれば、LZ4でごっそり小さくなる分クライアントのレスポンスがその分確実に速くなりますからね。

過去にサーバー側もセットで作ったXamarinのアプリでメンテナンスしているものがいくつかあるので、隙を見てどれかにちょっと入れてみようと思います。