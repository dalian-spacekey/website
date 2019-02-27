---
title: "Xamarin.Formsで状態による表示切り替え"
date: "2019-02-27"
tags: ["Xamarin.Forms", "XAML"]
---

アプリを作っていると、何らかデータの状態によって画面の一部だけの表示が変わったり、操作できるものが変わるケースがあります。  
単なるラベル的な表示の切り替えであれば、表示内容自体をViewModelから切り替えてあげればいいんでしょうけど、データの状態よって表示内容や操作内容が変わるケースでは、状態ごとに部品を作っておいてそれらの表示を切り替える、みたいなやり方が必要になります。

例えば、画面上のある項目が、

1. Aの場合は「開始不可」の表示だけ
2. Bの場合は「開始するボタン」が表示され、タップを促す
3. Cの場合は「結果を入力するテキストボックス」が表示され、入力を促す
4. Dの場合は「結果が表示されるラベル」が表示される

みたいな仕様だと、1の場合は固定のラベル、2の場合はボタン、3の場合はテキストボックス、4の場合は変数的なラベルを置くことになります。

```xml
<Grid>
  <Label Text="開始不可"/>
  <Button Text="開始する" Command="..."/>
  <Entry Text="{Binding ...}" Placeholder="結果を入力"/>
  <Label Text="{Binding ...}"/>
</Grid>
```

簡略的ですが、まずはXAMLでこんな感じに組み立てておいて、後は状態によってどのコントロールが表示されるか制御することになるかと思います。

で、これをどうやって制御するのがいいのかっていうのが今回の問題です。

## Converterを使う

まず、ViewModel側に"Status"というプロパティを用意しておいて、そこにA～Dの状態をセットするようにしておくとします。

そして、下記のようなConverterを用意。

```csharp
public class SampleConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is string v && parameter is string p)
            return v == p;

        return false;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

で、XAMLの各コントロールのIsVisibleを下記のようにします。

```xml
<Grid>
  <Label Text="開始不可"
         IsVisible="{Binding Status, Converter={StaticResource SampleConverter}, ConverterParameter=A}"/>
  <Button Text="開始する" Command="..."
          IsVisible="{Binding Status, Converter={StaticResource SampleConverter}, ConverterParameter=B}"/>
  <Entry Text="{Binding ...}" Placeholder="結果を入力"
         IsVisible="{Binding Status, Converter={StaticResource SampleConverter}, ConverterParameter=C}"/>
  <Label Text="{Binding ...}"
         IsVisible="{Binding Status, Converter={StaticResource SampleConverter}, ConverterParameter=D}"/>
</Grid>
```

Converterはこういう使い方以外でも、何かをBindingするようなところで、入ってくる値と別のものをXAMLに出力したいときは非常に便利です。  
が、上記のように汎用的に使えるものだといいんですが、判定のための固定値が入ってくるケースがあったりすると、なんかちょっと違和感が出てきます。

例えば、Status=A|B|C|Dじゃなくて、何らかの数値がどの範囲か？みたいなケースだと、Converterに判定のため値を直書きしないといけないか、ViewModel等で数値の判定をして別途A,B,C,Dみたいなステータスに変換してから上記のようにするとか、ちょっと1枚余分に噛んでる感が出てきます。

## DataTriggerを使う

TriggerにはDataTriggerという種類のものがあるので、それをつかってStatusを判定して表示非表示を切り替えます。

```xml
<Grid>
  <Label Text="開始不可" IsVisible="False">
    <Label.Triggers>
      <DataTrigger TargetType="Label"
                   Binding="{Binding Status}"
                   Value="A">
        <Setter Property="IsVisible" Value="True"/>
      </DataTrigger>
    </Label.Triggers>
  </Label>
  <Button Text="開始する" Command="..." IsVisible="False">
    <Button.Triggers>
      <DataTrigger TargetType="Button"
                   Binding="{Binding Status}"
                   Value="B">
        <Setter Property="IsVisible" Value="True"/>
      </DataTrigger>
    </Button.Triggers>
  </Button>
  <Entry Text="{Binding ...}" Placeholder="結果を入力" IsVisible="False">
    <Entry.Triggers>
      <DataTrigger TargetType="Entry"
                   Binding="{Binding Status}"
                   Value="C">
        <Setter Property="IsVisible" Value="True"/>
      </DataTrigger>
    </Entry.Triggers>
  </Entry>
  <Label Text="{Binding ...}" IsVisible="False">
    <Label.Triggers>
      <DataTrigger TargetType="Label"
                   Binding="{Binding Status}"
                   Value="D">
        <Setter Property="IsVisible" Value="True"/>
      </DataTrigger>
    </Label.Triggers>
  </Label>
</Grid>
```

これだとXAMLだけで切り替えができますし、いっぺんに複数のプロパティを触れますので、Converterだとやりづらい操作ができます。  
比較的スマートなんですが、XAMLがやたらごちゃついて見えるのがデメリットですし、細かい値の判定などが絡んでくると、結局Converterのお世話にならないといけない線が見えてきます。

## 一個ずつプロパティを用意する

ViewModel側に、AVisible、BVisible、CVisible、DVisibleのプロパティを用意して、個別に制御します。

```xml
<Grid>
  <Label Text="開始不可"
         IsVisible="{Binding AVisible}"/>
  <Button Text="開始する" Command="..."
          IsVisible="{Binding BVisible}"/>
  <Entry Text="{Binding ...}" Placeholder="結果を入力"
         IsVisible="{Binding CVisible}"/>
  <Label Text="{Binding ...}"
         IsVisible="{Binding DVisible}"/>
</Grid>
```

非常にもっさりして見えます。  
当然ですが、ViewModelでViewの表示どうこうを直接触る感じになるので、責務の分離をきっちりしたい場合はやらない方がいい感じが出てきます。
(私はそこまで厳密じゃないので、シンプルに見えるならやっちゃいますが)

これまで触ってきたコードにはこういうやつがいくつかあります。  
元々状態が2つしかなくて「表示する/しない」だったものが、1つ増え、2つ増え……しかもその状態の判定基準が、後から追加されてきた値を複合的に判定する、みたいな経緯をたどってきて、ちょっと元あるコードを触りたくない、ってパターンでリファクタリングされずに残ってるケースです。

仕組み的にはアレですが、どう表示/非表示されるかは、ViewとViewModelだけ見とけばいいので若干わかりやすいでしょうか。

## まとめ

多分、よく使われるパターンはConverterでしょうかね。  
ただConverterも、なんかたった1カ所のために作るようなものもあったりして、なんとなく冗長さを感じることもあるんですよね。  
またDataTriggerも、XAMLがシンプルなうちはいいんですけど、実際はどんどん複雑になって行きますし、なかなかぱっと見て何やってるかわかりづらくなるってのが難点です。  
最後のやつは、最初から作る場合はもちろん避けるべきパターンですが、ある程度長期的に触るコードだったりとか、事情によってはこういうパターンもあるよねってことで。