---
layout: post
title: ASP.NET CoreのAngularテンプレートのbootstrapを4に変更する
date: 2017-09-07
tags: [".NET Core","Angular"]
---

## bootstrapのバージョンアップ

現時点ではまだbeta版なので、npmでバージョン指定をして更新します。

```bash
npm install --save bootstrap@v4.0.0-beta
```

## popper.jsのインストール

bootstrap4は[popper.js](https://popper.js.org/)が必要です。

```bash
npm install --save popper.js
```

(.jsが付かない"popper"というnpmパッケージがあったりするので間違えないように。間違って.jsなしのをインストールしていてしばらくハマった)

## webpackの設定を書き換える

webpack.config.vendor.jsの内容を変更して、popper.jsも処理されるようにします。

```javascript
    const nonTreeShakableModules = [
        (省略)
        'jquery',
        'popper.js'
    ];
```

44行目あたりにある、

```javascript
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
```

この行に、popper.jsの設定を追加します。

```javascript
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', Popper: ['popper.js', 'default'] }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
```

## 完了

あとはwebpackでvendor関連を再構築したら完了です。

popper.jsやwebpackの変更をしない状態の場合、jQueryがどうとか、popperがないとかいうエラーが出ます。

あと、実行してみたらわかりますが、bootstrap4は3からだいぶ変わっているので、豪華なHelloWorldはちょっとおかしなことになります。もし3でなにか開発中の場合は全画面作り直すことは覚悟しないといけません。

webpackがまだいまいち把握できてないので、まだなんかいろんなところに手が届いてないような感覚が抜けません。さらにbootstrapだ、angularだと、調べないといけないことが多すぎてつらい。