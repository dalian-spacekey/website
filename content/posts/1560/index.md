---
layout: post
title: Windows 10 - 1607でWPFから呼んでいるTabTip.exeが表示されない
date: 2016-08-16
tags: ["CSharp","Windows"]
---

タブレットで動かすWPFアプリケーションでは、ソフトウェアキーボードを制御できないので、適宜テキストボックスフォーカス時などに、c:\Program Files\Common Files\microsoft shared\ink\TabTip.exeを呼び出すようなことになります。

で、たまたまその仕組みを使っていたアプリケーションを改修していたところ、ソフトウェアキーボードが出ないようになってることに気がつきました。Anniversary Updateのせいみたいです。

調べてみたところ、HKEY_CURRENT_USER\SOFTWARE\Microsoft\TabletTip\1.7にEnableDesktopModeAutoInvokeというキーを作って、DWORD値を1にすれば良いと言うことだったので試してみたら表示されるようになりました。

[Show touch keyboard (TabTip.exe) in Windows 10 Anniversary edition](http://stackoverflow.com/questions/38774139/show-touch-keyboard-tabtip-exe-in-windows-10-anniversary-edition)