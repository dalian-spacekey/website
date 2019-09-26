---
layout: post
title: ASP.NET Core(2.0)のAngularテンプレートでng-bootstrapなどを使おうとするとwebpack --env.prodでエラーが出る話
date: 2017-09-07
tags: ["NET Core","Angular"]
---

ちょっとコンポーネントを使いたくてng-boostrapを入れたら、開発中とかdevbuildの時は問題ないのに、production buildをしようとすると謎のエラーを吐かれます。

    ERROR in ./$$_gendir/~/@ng-bootstrap/ng-bootstrap/alert/alert.ngfactory.ts
    Module parse failed: C:\(省略)\$$_gendir\node_modules\@ng-bootstrap\ng-boots
    rap\alert\alert.ngfactory.ts Unexpected token (13:21)
    You may need an appropriate loader to handle this file type.
    ' import * as i2 from '@ng-bootstrap/ng-bootstrap/alert/alert';
    ' import * as i3 from '@ng-bootstrap/ng-bootstrap/alert/alert-config';
    ' const styles_NgbAlert:any[] = ([] as any[]);
    ' export const RenderType_NgbAlert:i0.RendererType2 = i0.ɵcrt({encapsulation:2,styles:styles_NgbAlert,
    '     data:{}});
    @ ./$$_gendir/ClientApp/app/app.module.browser.ngfactory.ts 10:0-103
    @ ./ClientApp/boot.browser.ts

細かいところはimportしているコンポーネント次第だと思いますが、「なんとか.ngfactory.ts」で「Unexpected token」だとか言うあたりは共通してると思います。

ライブラリの問題かと思って別のものに入れ替えてみたりしたんですが、どうもwebpackでtypescriptをコンパイルしている段階だし、devでは動作しているのでライブラリのせいじゃない。

心が折れそうになりながら調べていたら、

[https://github.com/aspnet/JavaScriptServices/issues/1168#issuecomment-320026397](https://github.com/aspnet/JavaScriptServices/issues/1168#issuecomment-320026397)

という情報を発見。

webpack.config.jsの20行目あたり

    { test: /\.ts$/, include: /ClientApp/, use: isDevBuild ? ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] : '@ngtools/webpack' },

こうなってるところの、「include: /ClientApp/」を削除します。

    { test: /\.ts$/, use: isDevBuild ? ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] : '@ngtools/webpack' },

これで無事にproduction buildも出来るようになりました。  

どうやら不具合っぽいので、いずれ修正されるみたいです。

こういうタイプのトラブルは、出口のわかりづらい試行錯誤の繰り返しなので、なかなか心が削られます。