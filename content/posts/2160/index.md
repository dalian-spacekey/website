---
title: "Xamarin.FormsとFirebase Cloud Messagingでカスタムのプッシュ通知音を鳴らす"
date: "2018-08-06"
tags: ["Xamarin","Firebase","iOS","Android"]
---

プッシュ通知を実装しているXamarin.Formsアプリで、通知が来たときに独自の音を鳴らしたい、ということでやってみました。
Firebase Cloud Messaging(FCM)を使っています。

FCMのライブラリは下記の通りです。

* Xamarin.Firebase.iOS.CloudMessaging(v2.0.8.1)
* Xamarin.Firebase.Messaging(v60.1142.1)

ちなみに、Xamarin.Formsはv3.1.0.583944です。

## アプリ側の準備

iOSではプッシュ通知で慣らせるサウンドはaiff、caf、wav、Androidではmp3、ogg、wavということなので、それぞれ必要な形式の音声ファイルを準備します。

このとき、両方ともwavで準備するのであれば同じファイル名にすればいいはずなんですが、それぞれ違うフォーマットの場合は、

* iOS側 : ファイル名.[iOS側の拡張子]
* Android側 : ファイル名.[iOS側の拡張子].[Android側の拡張子]

という名前にしておけば、サーバーからサウンドファイルを指定しやすくなります。
iOS側が「sample.caf」だった場合は「sample.caf.mp3」という感じです。

iOS用にaiffやcafに変換するには、afconvertを使います。

```bash
afconvert -f caff -d ima4 sample.mp3 sample.caf
```

こんな感じです。

それぞれのファイルは、

* iOS側 : Resourcesフォルダ(ビルドアクションはBundleResource)
* Android側 : Resources/rawフォルダ(ビルドアクションはAndroidResource)

に配置します。

## サーバー側の準備

"fcm/send"でPOST送信するときのrequest bodyのnotificationの中に"sound": "ファイル名"を追加するだけです。

サーバー側はC#ですのでこんな感じになっています。
(iOSのサウンドファイル名をsample.caf、Androidはsample.caf.mp3)

```C#
var parameter = new
{
    to,
    notification = new
    {
        body,
        title,
        sound = "sample.caf"
    }
}
```

iOSは拡張子付きじゃないと鳴ってくれないんですが、Androidの方は拡張子はよしなにしてくれるみたいなので、こういう指定の仕方にしておくと通知先がどっちでも大丈夫、ということです。

## 疑問

Firebaseのコンソールからプッシュ通知のテストするときにsoundの指定ができるんですが、なんかどう指定しても音が鳴ってくれませんでした。iOSの方はいろいろ試してみてもdefaultの音が鳴るし、Androidの方は無音通知になってしまいます。
Firebaseコンソールの問題なんですかね。
なんかアプリ側に問題があると思って、いろいろ調べて試行錯誤してたんですが、実際のサーバーで試してみたらサクッと音が鳴ったので、なんとなくすっきりしない感じです。