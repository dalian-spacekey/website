---
layout: post
title: AutoScrollPositionに座標をセットしてもスクロールされない
date: 2014-01-21
tags: ["CSharp"]
---

C#で、画像を表示させて拡大縮小、回転などをするフォームを作成していたのですが、PanelのAutoScrollPositionではまりました。

1.  フォームにPanelを配置
2.  PanelのAutoScrollプロパティをtrueに
3.  PanelにPictureboxを配置
4.  PictureboxのSizeModeプロパティをAutoSizeに

という感じにすると、Panelのサイズを超える画像をロードしても自動的にスクロールバーが出てスクロールできるようになります。

このとき、例えば上下のスクロールをすると、PanelのAutoScrollPositionのYはマイナス値で取得できます。  
 まあ、座標は下に行くほど数値が増えますので、Panelの中身が上に行くとYが0よりも小さくなる......というのは納得できる感覚だったりします。つまり、Panelの中身の左上座標がどこにあるのかと言うことですね。

で、画像が表示されたときに100ピクセルほど下にスクロールさせておきたい、という状況になったら、AutoScrollPositionにnew Point(0, -100)とか、手でスクロールしたときと同じ値を入れようとしますよね。

でもこれが全然機能しない、うんともすんとも言わない、代入直後のAutoScrollPositionをみても0,0のまま。  
 もしかしてこれって取得だけしかできない!?とか思って下記をよく読んでみたら......

[ScrollableControl.AutoScrollPosition プロパティ - MSDN](http://social.msdn.microsoft.com/Forums/vstudio/ja-JP/bc68a305-09ab-4c0e-882a-e798dd690297/panel?forum=vbgeneralja)
> コントロールがスクロールされてその開始位置 (0,0) から離れた場合、取得される X 座標値と Y 座標値は負の値になります。 このプロパティを設定するときは、X と Y に必ず正の値を割り当てて、開始位置を基準として相対的にスクロール位置を設定する必要があります。

取得時はマイナスで出てるものを、設定時はプラスにせよと......  
なので常に設定するときは、プラスマイナスひっくり返してやらないといけません。  
これはわかりませんよねぇ。