---
title: C#でTWAINスキャナから画像の取込
date: 2013-04-18
tags: ["CSharp"]
category: page
---

C#で、TWAINスキャナを使って画像を取得する方法を模索してみました。
調べてみてもこういった方面について記載しているページが少ないのですが、[CodeProject](http://www.codeproject.com/)で見つけました。

TWAIN以外にも、WIA (Windows Image Acquisition)という技術もあるようなのですが、サポート状況がいまいちとか言う情報もあり、これについてもプログラミング的な情報も少ないですね。

<!--more-->

## 前提

基本的には、.NET TWAIN image scanner([http://www.codeproject.com/KB/dotnet/twaindotnet.aspx](http://www.codeproject.com/KB/dotnet/twaindotnet.aspx "http://www.codeproject.com/KB/dotnet/twaindotnet.aspx"))のサンプルコードを元にしています。

あと、取得したイメージをbitmapで取り出せるようにするために、[http://www.codeproject.com/KB/dotnet/twaindotnet.aspx?msg=386654#xx386654xx](http://www.codeproject.com/KB/dotnet/twaindotnet.aspx?msg=386654#xx386654xx)の書き込みにリンクが張られているzipファイルからDibToImageというコードをもらっておきます。

サンプルコードに手を加えるポイントとしては、

1.  複数枚のスキャンに対応する
(サンプルコードでは1枚分のイメージのみしか取り出せない)
2.  イメージの取り出しがめんどくさい感じになっているのをbitmapで得られるようにする
(イメージ取得してから何か処理がしたいときにいちいちファイルに出したくないこともある)
3.  スキャン前の設定ダイアログを表示しないようにする
(すでにスキャナで設定されていればそのままスキャンに進みたい)

といったところになります。

## 1.複数枚のスキャンに対応する

これは非常に簡単です。TwainLib.csのAcquire関数の中身を1カ所変えるだけです。

    //最後の引数を1から-1に変更
    TwCapability cap = new TwCapability(TwCap.XferCount, -1);

これだけです。

## 2.イメージの取り出しがめんどくさい感じになっているのをbitmapで得られるようにする

サンプルだと、表示用のフォームに渡してGDI関連で表示させてますが、この辺はさくっとbitmapでもらえるようになってるとわかりやすいですね。
そのために、冒頭で記したDibToImageを使って、bitmapに変換してから取得するようにしてみました。

MainFrame.csのIMessageFilter.PreFilterMessageに、TwainCommand.TransferReadyのメッセージを処理しているところがありますので、ここを改変します。

    case TwainCommand.TransferReady:
        {
            ArrayList pics = twain.TransferPictures();
            this.EndingScan();
            twain.CloseSrc();

            for (int i = 0; i < pics.Count; i++)
            {
                IntPtr dibPtr = GlobalLock((IntPtr)pics[i]);
                Bitmap bitmap = DibToImage.WithStream(dibPtr);
                this.images.Add(bitmap);
            }
            break;
        }

フォームにポインタを渡しているところを、DibToImageのWithStream関数でbitmapオブジェクトに変換しています。
その後は、List<Image>型のimagesという変数を宣言してありますので、そこにさっくり放り込んでいます。この辺は、アプリケーションなどによってやりたいことがいろいろ違うでしょうから、まあ適当に......あんまり大きなイメージを大量に取り込むようなときはメモリが厳しいですよ。

GlobalLock関数は、イメージが格納されているメモリ領域から取り出す際に、その領域をロックしておくために必要です。

    [DllImport("kernel32.dll", ExactSpelling = true)]
    internal static extern IntPtr GlobalLock(IntPtr handle);

を宣言しておいてください。
(System.Runtime.InteropServicesの参照が必要ですよ)

## 3.スキャン前の設定ダイアログを表示しないようにする

元の状態だと、スキャンを開始すると必ずスキャン設定のダイアログが出ると思われます。
扱いに慣れているユーザーであればよいですが、スキャン設定を 変えてほしくない場合とか、操作を簡単にしたい場合などは、ダイアログが出ずにスキャナが動いてくれるといいですね。

TwainLib.csのAcquire関数インターフェースの設定をする場所があります。

    TwUserInterface guif = new TwUserInterface();
    guif.ShowUI = 0;    //1を0に変更
    guif.ModalUI = 0;  //1を0に変更
    guif.ParentHand = IntPtr.Zero;    //hwndをIntPtr.Zeroに変更

という風にすると、ダイアログが表示されず、すぐにスキャニングが始まります。
ただし、キャンセルボタンの出るダイアログは出てしまいます。

このあたりも、状況に応じて切り替える仕組みにすれば良いんじゃないでしょうか。

こんな感じです。
実際はもっといろいろな制御が出来ると思われますが、TWAINの仕様を学ばねばなりません。結構複雑なんですよね。
業務用アプリケーションでちょこっと添付ファイル的な扱いをするのだったらこのぐらいで十分かと 思われます。

## あとがき

今回いろいろ調べた情報源としては、

.NET TWAIN image scanner
[http://www.codeproject.com/KB/dotnet/twaindotnet.aspx](http://www.codeproject.com/KB/dotnet/twaindotnet.aspx "http://www.codeproject.com/KB/dotnet/twaindotnet.aspx")

の下にくっついているフォーラム(かなり大量のメッセージがあります)は英語ですが、結構情報量があります。

C#でTWAINを操作してみる(ニヤリ TechSide)
[http://d.hatena.ne.jp/twisted0517/20090327/1238143282](http://d.hatena.ne.jp/twisted0517/20090327/1238143282)

では仕組みについて一部書いておられるので、参考にさせてもらいました。
また、「ドライバ名指しでのTWAIN機器の選択」のサンプルコードもあります。複数のスキャナ等のデバイスがつながっていて、選択が必要になる場合は使えるコードですね。