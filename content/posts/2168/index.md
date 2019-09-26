---
title: "Xamarin.Essentialsへの置き換え"
date: "2018-12-27"
tags: ["Xamarin"]
---

[Xamarin.Essentials](https://github.com/xamarin/Essentials)

Xamarinで使えるいろんな機能がまとまったライブラリです。  
ずっと前から気になってたんですが、なかなか正式リリースされなかったので実戦投入を待ってました。

やれることはここにまとまってます。

[https://docs.microsoft.com/ja-jp/xamarin/essentials/](https://docs.microsoft.com/ja-jp/xamarin/essentials/)

これまではこの中のいくつかは、別のライブラリで、またいくつかはAndroid/iOSそれぞれの実装でやったりと、どうしても"つぎはぎ"感が見え隠れしてましたが、これでけっこうすっきりすると思います。

とりあえず今やってるプロジェクトで入れ替えたのが下記の機能。

* Connectivity : Xam.Plugin.Connectivityを置き換え
* Share : Plugin.Shareを置き換え
* PhoneDialer : Xam.Plugins.Messagingを置き換え
* Clipboard : Android/iOSでそれぞれコードを書いてました
* Browser : Android/iOSでそれぞれコードを書いてました
* AppInfo : VersionStringを得るようなコードをAndroid/iOSでそれぞれで書いてました

Geolocationも、Xam.Plugin.Geolocatorから置き換えようと思ったんですが、PositionChangedイベントを使っているところが書き直しになるので、とりあえず後回しにしました。

他にも、外部のライブラリを使ってるわけじゃないですが、こっちの機能を使うと統一感がでますし、なにより本家で作ってるものなのでXamarinが続く限りメンテナンスはしてくれるだろうという安心感はありますから、いずれ統一していった方がよさそうですねぇ。