---
layout: post
title: JavaScript
date: 2013-07-15
tags: ["JavaScript"]
---

今、あるプロジェクトでJavaScriptのプログラムを触っていますが、これがなかなか大変です。

クライアント側がHTML+JavaScriptの、長年かけて色んな人の手が入ってるもので、もうあらゆるものがグローバルに充ち満ちている状況になっています。
同じような機能を持つ関数や使われてなさそうな関数が、たくさんのスクリプトファイルや、メインとなるhtmlにも定義されています。
データベースとのやりとりもちょっと独特な組み方がしてあって、ぱっと見てどういうデータがやりとりされるのかわかりにくい状況です。
スタイルシートも、CSSファイル、HTMLファイルのhead部分、そしてインラインに分散されていて、なかなか難儀です。

問題点を整理すると下記のような感じです。

1.  <span style="line-height: 13px;">関数や変数がほぼすべてグローバルオブジェクトとなっている。</span>
2.  スクリプトが、head部分、独立したファイル、htmlタグのインラインに分散しすぎている。
3.  全く使われていないスクリプトファイルもロードされている。
4.  同じような機能(全く同じものもある)の関数がいくつもあったりする。
派生型みたいなものも整理されないまま。
5.  コーディングスタイルが統一されておらず、コメントも乱雑でとにかく汚い。
6.  CSSもあちこちに分散している。
JavaScriptの自由度が災いする典型的な感じになっています。
しかもこのシステムがベースになって、多くの顧客向けにカスタマイズされた派生システムがかなりあり、それぞれが色んなメンバーや拠点が担当して手を入れてありますので、かなりカオスな状態です。
今後長くお付き合いするかもしれないこともあるので、何とか早いうちにこれを整理しようと試行錯誤中です。

何しろ、JavaScriptを業務でこれだけ使い倒したことはなく、システムのちょっと補助的な部分だとか、お勉強として知っているレベルです。
しかも言語的に柔軟性が相当ある代物ですので、何か1個やるにも色んな書き方ができたりするので、調べては書き、書いては調べを繰り返している状況です。
CSSもHTMLも、すでにあるものに手を入れるぐらいしかやっていないので、全面的に整理するとなると相当お勉強が必要ですね。

クリアすべき課題は下記の通りです。

1.  <span style="line-height: 13px;">共通の関数やクラス等をnamespaceを使って整理して、グローバル汚染をなくす。
</span>
2.  コーディングスタイルを統一する。
3.  JsDocの形式でコメントを整備、リファレンスを生成できるようにする。
4.  HTMLの中に食い込んでいるJavaScriptやスタイルを分離する。
5.  QUnitでテストコードを用意する。
6.  jQueryを導入して書き方をすっきりさせる。
7.  Seleniumを使ってテストできるようにする。
一応、一通り調べたり試したりしてなんとなく方向性は見えてきましたが、なにぶん既存の業務系のシステムは過去の経緯や、それぞれの処理に特化したコードなどから実際やってみたらうまくいかなそうなところも見えてきました。なかなか大変ですね。
今後ちょっとずつ蓄積され始めた情報を書いていこうと思います。