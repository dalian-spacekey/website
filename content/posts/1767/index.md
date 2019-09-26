---
layout: post
title: ASP.NET Core WebアプリケーションのAngularテンプレートのサーバーサイドレンダリングをやめる方法(.NET Core 2.0)
date: 2017-08-25
tags: ["NET Core","Angular"]
---

Visual Studioやdotnet newで作ることのできるAngularのプロジェクトは、最初からサーバーサイドレンダリングに対応したものが出来るのですが、慣れないうちは仕組みがよくわからなかったりとか、もっとシンプルな状態から理解を進めたいときにはややこしくて邪魔になりますので、その辺を削除してみます。

## Views/Home/index.cshtml

```html
    <app asp-prerender-module="ClientApp/dist/main-server">Loading...</app>
    ↓
    <app>Loading...</app>
```

実際はこれだけでサーバーサードレンダリングは行われなくなります。
まずは、main-serverがスタートすることでアプリケーションが始まるようになってるようで、クライアント側の準備が出来たら切り替わるんだと思います。

※これ以降は無理にやらなくてもいいんですが、そのままにしてしまうとなんか変な中途半端感がコードに残ってしまうので・・・

```html
    <script src="main.js" asp-append-version="true"></script>
```

あとの作業用に、ここのファイル名も変えておきます。

## webpack.config.js

32行目あたりのファイル名を変えます。

```javascript
    entry: { 'main-client': './ClientApp/boot.browser.ts' },
    ↓
    entry: { 'main': './ClientApp/boot.ts' },
```

50,51行目あたりを書き換えます。

```javascript
    entryModule: path.join(__dirname, 'ClientApp/app/app.module.browser#AppModule'),
    exclude: ['./**/*.server.ts']
    ↓
    entryModule: path.join(__dirname, 'ClientApp/app/app.module#AppModule')
```

56行目あたりの下記部分をばっさり削除。

```javascript
    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig, {
    (中略)
        target: 'node',
        devtool: 'inline-source-map'
    });
```

最後の部分のserverに関する部分を削除。

```javascript
    return [clientBundleConfig, serverBundleConfig];
    ↓
    return [clientBundleConfig];
```

webpackでサーバーサイド用のビルドをする部分ですね。

## webpack.config.vendor.js

74行目あたりの下記部分をばっさり削除。

```javascript
    const serverBundleConfig = merge(sharedConfig, {
        target: 'node',
        resolve: { mainFields: ['main'] },
    (中略)
                name: '[name]_[hash]'
            })
        ]
    });
```

最後の部分のserverに関する部分を削除.

```javascript
    return [clientBundleConfig, serverBundleConfig];
    ↓
    return [clientBundleConfig];
```

これも同様。

## ClientAppディレクトリ以下

余計なファイルを削除して、ファイル名の変更等を行います。

### 削除

* ClientApp/boot.server.ts
* ClientApp/app/app.module.server.ts
* ClientApp/distディレクトリ(もし既に実行していたら)

### リネーム

* ClientApp/boot.browser.ts　→　ClientApp/boot.ts
* ClientApp/app/app.module.shared.ts　→　app.module.ts

### ClientApp/app/app.module.ts

リネームしたshared.tsにapp.module.browser.tsの一部のコードをマージします。

```typescript
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { CommonModule } from '@angular/common';
    import { FormsModule } from '@angular/forms';
    import { HttpModule } from '@angular/http';
    import { RouterModule } from '@angular/router';

    import { AppComponent } from './components/app/app.component';
    import { NavMenuComponent } from './components/navmenu/navmenu.component';
    import { HomeComponent } from './components/home/home.component';
    import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
    import { CounterComponent } from './components/counter/counter.component';

    @NgModule({
        bootstrap: [AppComponent],
        declarations: [
            AppComponent,
            NavMenuComponent,
            CounterComponent,
            FetchDataComponent,
            HomeComponent
        ],
        imports: [
            BrowserModule,
            CommonModule,
            HttpModule,
            FormsModule,
            RouterModule.forRoot([
                { path: '', redirectTo: 'home', pathMatch: 'full' },
                { path: 'home', component: HomeComponent },
                { path: 'counter', component: CounterComponent },
                { path: 'fetch-data', component: FetchDataComponent },
                { path: '**', redirectTo: 'home' }
            ])
        ],
        providers: [
            { provide: 'BASE_URL', useFactory: getBaseUrl }
        ]
    })
    export class AppModule {
    }

    export function getBaseUrl() {
        return document.getElementsByTagName('base')[0].href;
    }
```

そのあと、app.module.browser.tsは削除します。

### ClientApp/app/boot.ts

```typescript
    import { AppModule } from './app/app.module.browser';
    ↓
    import { AppModule } from './app/app.module';
```

マージしてしまっているので、app.moduleをimportするように修正します。

## おわり

これでとりあえずサーバーサイドレンダリングを使っているようなところはあらかた消えてると思います。
削除できるモジュールがあると思うんですが、まだちょっとその辺は試してません。

何でこれやろうと思ったかというと、localStorageを使うようなコードがなんかうまく動かず、サーバーサイドで動いてるからだと気がつくまで結構ハマったからです。実際、作ろうとしているものも規模の小さいシンプルなものなので、ややこしい部分をなくしておきたかったと言うことで。

あと、これ動作するサーバーでnodeが使えないような状況では、サーバーサイドのコードは動かない気もします。

Webアプリケーション関連は、とにかく細かい技の組み合わせが多すぎて、なんか動くようなものを作るのに一苦労です。