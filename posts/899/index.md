---
layout: post
title: VMWareの仮想マシンのディスクファイルを縮小する
date: 2015-05-22
tags: ["VMWare"]
---

VMWareの仮想マシンで一時的にディスク領域を沢山使うと、ディスクイメージのファイルが膨らんだままになってしまいます。
そういう場合は仮想マシンの方で

    vmware-toolbox-cmd disk shrink /

とやると無駄な領域を削除してくれます。
ゲストがWindowsの場合は、VMwareToolboxCmd.exeです。

VMWareToolsが入っている必要があります。