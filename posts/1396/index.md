---
layout: post
title: VMWare FusionのWindows10を 1607(anniversary update)にアップデートしたらフォルダ共有ができなくなる
date: 2016-08-03
tags: ["VMWare","Windows"]
---

Windows10の1607が公開されましたが、Windows Updateで落ちてくる気配がなかったので、VMWare Fusionで使っているWindows10環境を手動でアップデートしたところ、VMWareのファイル共有が効かなくなりました。

Windowsに限らず、VMWareを使っていると時々あることで、そういう場合は何らかの原因でVMWare Toolsがちゃんと動いていないケースがほとんどですので、VMWare Toolsを再インストールとかしてみれば大丈夫なんですが、今回それではダメでした。

ちょっと調べてみたら、共有フォルダが使えなくなる原因は下記の理由みたいです。

[3. Re: Shared Folders - Windows 10 upgrade from 15.11.](https://communities.vmware.com/message/2556646#2556646)

この書き込み自体は去年末のWindows10-1511のアップデートの時にされたものですが、内容としては「Windowsのアップデートによって、ネットワーク関連のレジストリ設定から、VMWareのファイル共有プロトコルが消えてしまう」ことにあるみたいなので、もしかしたら今回も同じかも知れないと思って、確認してみましたら、確かにvmhgfsというのが無い状態でした。

    HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\NetworkProvider\Order
    Name: ProviderOrder
    Type: REG_SZ
    Data: "RDPNP, LanmanWorkstation,webclient"

    Modify to:
    Data: "vmhgfs,RDPNP, LanmanWorkstation,webclient"

ということで、先頭にvmhgfsを追加したらすぐに反映されるようになりました。
レジストリ操作にありがちな、再起動/ログオフなどは不要です。
VMWare Toolsの再インストールも不要です。

この書き込みの人は、この共有ファイル機能を担当している開発者みたいで、そりゃもうどんぴしゃな答えですよね。

### まとめ

* HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\NetworkProvider\Order
* ProviderOrderの値に"vmhgfs"が無ければ、それを先頭に追加する。
* 再起動やログオフ不要、すぐに反映される。
* VMWare Toolsの再インストールなども不要。