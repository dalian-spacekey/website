---
title: "Xamarin.iOSでCS1703:Multiple assemblies with equivalent identity have been imported"
date: "2018-12-22"
tags: ["Xamarin"]
---

Xamarin.FormsでMessagePackを使ってみようと思い、nugetでサクッとパッケージを入れたら、iOSプロジェクトのビルドでエラーが出ます。

```plain
CS1703:ID が同一の複数のアセンブリ ('C:\Users\spacekey\.nuget\packages\system.reflection.emit\4.3.0\ref\netstandard1.1\System.Reflection.Emit.dll' と 'C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\IDE\ReferenceAssemblies\Microsoft\Framework\Xamarin.iOS\v1.0\Facades\System.Reflection.Emit.dll') がインポートされました。重複している参照の一方を削除します。
```

これを解決しようとして、調べると解決策が見つかりますが、変なところにはまり込みました。

## 状況

* Visual Studio 2017 15.9.4
* Xamarin.iOS 12.2.1.12
* Xamarin.Forms 3.4.0.1008975
* Prism.Unity.Forms 7.1.0.431
* MessageePack 1.7.3.4

ベースになってるプロジェクトはPrism Blank Appで、Xamarin.FormsやPrism.Unityはnugetでアップデートしています。その後、nugetでMessagePackをインストールします。

で、特になにも実装せず、iOSプロジェクトの方をビルドするとエラーが出ます。

## CS1703の解決法

ググると解決法が見つかります。

[How to resolve compilation issue CS1703 error in a Xamarin.iOS project](https://www.spacelinx.com/2018/02/06/how-to-resolve-compilation-issue-cs1703-error-in-a-xamarin-ios-project/)

iOSプロジェクトのPackageReferenceがあるItemGroupに、下記を追記します。

```xml
<PackageReference Include="System.Reflection.Emit">
  <Version>4.3.0</Version>
  <ExcludeAssets>all</ExcludeAssets>
</PackageReference>
```

Visual Studioで、いったんiOSプロジェクトを右クリックからアンロードして、さらに右クリックで編集で、上記を追記します。

```xml
  <ItemGroup>
    <PackageReference Include="Xamarin.Forms" Version="3.4.0.1008975" />
    <PackageReference Include="Prism.Unity.Forms" Version="7.1.0.431" />
    <PackageReference Include="System.Reflection.Emit">
      <Version>4.3.0</Version>
      <ExcludeAssets>all</ExcludeAssets>
    </PackageReference>
  </ItemGroup>
```

今回の場合、こんな感じになります。  
で、保存してプロジェクトの再読み込みで完了です。

## はまりどころ

さて、これでビルドをするとエラーが出ます。

```plain
Could not find any available provisioning profiles for iOS.
```

CS1703のエラーは出ないんですが、代わりに変なエラーが出ます。  
特にcsprojの編集にミスってるわけでもないし、ライブラリを入れる前はちゃんとビルドもできるし、Simulatorでも動くことは確認してありますので、プロファイルの問題ではありません。

さっき追加した記述を削除したら、元通りCS1703がでます。

### 解決法

さて、これどうやって解決するかというと……

「Visual Studioを再起動してソリューションを読み込み直す」

です。

ライブラリを触るような操作をしたあとは安全のため再起動、っていうやつですかね。

ちなみに、これはMessagePackだからというわけではなく、依存しているライブラリでバージョン不一致があると出るエラーなので、調べている過程でSystem.Reflection.Emit.dll以外でも困っている人がいるようでした。

やっと本題に入れます。