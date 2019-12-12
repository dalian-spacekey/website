---
title: "Windows版Slackでフォントを変更する"
date: "2019-10-16 0:00:00"
tags: ["Slack"]
---

※4.2.0になって編集するファイルが変わりました。

{{<linkcard "https://spacekey.info/posts/2184/">}}


Windows版Slackの日本語フォント表示がひどすぎるので変更する方法。

<!--more-->

現状、内部のファイルを書きかえる方法しかなく、バージョンアップする度に作業する必要があるのでメモ。 
4.0.2と4.1.1では大丈夫なのは確認してあります。

こちらのサイトをそのまま参考にさせてもらってます。

{{<linkcard "https://autotune.hatenablog.com/entry/2019/07/26/135700">}}

## 方法

asarが必要です。

{{<linkcard "https://github.com/electron/asar">}}

slackのapp.asarを展開して、フォントを変更するコードを追加して、またアーカイブして元に戻す、という方法です。

```
$ npm install -g asar
$ cd C:\Users\<USERNAME>\AppData\Local\slack\app-<VERSION>\resources
$ asar extract app.asar app
```

でapp.asarの中身が展開されるので、

```
C:\Users\<USERNAME>\AppData\Local\slack\app-<VERSION>\resources\app\dist\ssb-interop.bundle.js
```

一番最後に、下記のコードを付け加えます。

```
onload = () => {
  const style = document.createElement('style');
  style.innerHTML = '*{font-family:"Segoe UI","Yu Gothic UI","Sarasa Mono SC",sans-serif!important}';
  document.head.appendChild(style);
};
```

font-familyの内容は各自お好みで。  
本来のフォントはSegoe UIみたいですが、そうすると日本語がひどくなるのでYu Gothic UIに(Webで見たときと同じ見栄え)、あと私の場合簡体字も扱ってるのでSarasa Mono SCにしています。

あとは、

```
$ asar pack app app.asar
```

で元に戻せば表示が変わります。