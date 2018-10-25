---
title: "Xamarin.Forms 3.3"
date: "2018-10-25"
tags: ["Xamarin"]
---

Xamarin.Formsのバージョンアップが結構早いですね。
3.0へのメジャーアップデートがあってから、もう3回もアップデートされています。

* 3.0 : 6/27
* 3.1 : 8/2
* 3.2 : 10/3
* 3.3 : 10/17

しかもよく使いそうな機能が拡張されていっているので、リリース内容をよく見ておかないとつまらない手間をかけてしまいます。
直近では、Spanが3.1からBindableになったやつですね。

一緒に仕事をしているメンバーが、LabelのFormattedTextを使って、一部分だけが動的になるような表示を作っていたんですが、どうしてもその動的部分が表示されない。Label単体で動的部分だけ表示すると大丈夫なんだけど、FormattedTextにいれたSpan.Textがどうしても更新されない、って困ってたんですが、調べてみたら当時SpanはBindableじゃなかったのですね。
結局、StackLayoutにLabel3個入れて…みたいな作り方にせざるを得ませんでしたが、今ならもっと簡単です。
あと、説明の途中にリンクがあって、タップすると…みたいなやつも今なら簡単にできるようになったりとか、Label関連は最近いろいろ機能が増えて行ってます。

で、バージョンアップ内容とかは、たまたま見かけるXamarinの記事とかで断片的に入ってきていただけだったので、ちゃんとリリースノートを見てみました。

[Xamarin.Forms releases](https://developer.xamarin.com/releases/xamarin-forms/)

3.1以降のNotable Changesだけ見ても結構使えそうなものがあります。

* [3.1]SpanがBindableに
* [3.1]AndroidのTabbedPageでタブを下にできるようになった
* [3.1]Entry/Editor.IsSpelCheckEnabled
* [3.1]Switchの色指定
* [3.1]ScrollViewのスクロールバーを非表示可能に
* [3.1]UWPのボタンにAccessKey
* [3.1]Entry.IsTextPredictionEnabled(オートコンプリート的なやつ)
* [3.1]Sliderの色指定
* [3.1]Entryの確定ボタン指定(ReturnType,ReturnCommand,ReturnCommandParamter)
* [3.1]WebView.EvaluateJavaScriptAsync
* [3.1]UWPでTabbedPageにアイコン
* [3.1]Editor.AutoSize(Disabled/TextChanges)
* [3.1]ListView.SelectionMode(None/Single)
* [3.2]EntryのCursorPosition,SelectionLength,CursorColor(iOS)
* [3.2]SpanにGestureRecognizer
* [3.2]ButtonのPadding
* [3.2]BoxViewのCornerRadius(4つ個別指定可能)
* [3.2]NavigationPage.TitleView(カスタムレイアウト可能)
* [3.2]UISliderをタップで値変更できるようにする
* [3.2]Label.LineHeight/Span.LineHeight
* [3.3]Label.TextDecorations(None/Underline/StrikeThrough)
* [3.3]ラベルのMaxLines
* [3.3]iOSのWKWebViewのサポート
* [3.3]キーボード(tab)ナビゲーション(TabStopとかTabIndexとか、WinFormsでよく使うやつ)

「ListView.SelectionMode」なんかは、いちいち対応しなくてよくなるので助かるやつですね。
NavigationPageのTitleViewも、標準状態では微妙に手が届かないようなやつが作れるようになるので便利そう。

## Spanへのbind

で、BindableなSpan.Textにリベンジしようと思って、こんなサンプルコードを書き、Counterが1秒で上がっていくようにしたんですが…

```xml
    <Label>
      <Label.FormattedText>
        <FormattedString>
          <Span Text="現在"/>
          <Span Text="{Binding Counter.Value}"/>
          <Span Text="秒経過"/>
        </FormattedString>
      </Label.FormattedText>
    </Label>
```

![span1](span1.png)

変わりません。
いろいろ調べた結果、

```xml
    <Span Text="{Binding Counter.Value, Mode=OneWay}"/>
```

OneWayを指定してやらないとだめみたいです。

![span2](span2.png)

できることが増えていくのはうれしい限りですけど、その分調べたり試したりすることも増えるのでついて行くのはなかなか大変ですね。