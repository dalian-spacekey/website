---
layout: post
title: CentOS7をkvmで仮想環境のホストにする
date: 2015-03-02
tags: ["CentOS"]
---

CentOS7サーバーにkvmを入れて仮想マシンのホストにしておきます。  
 Dockerで......と言う方法もありますが、Windowsを使うこともありますし、仮想端末の方がわかりやすいこともあるので準備しておきます。

KVM インストール(Server World)  
 [http://www.server-world.info/query?os=CentOS_7&p=kvm&f=1](http://www.server-world.info/query?os=CentOS_7&p=kvm&f=1)

を参考にさせてもらいました。

### インストール

    # yum -y install qemu-kvm libvirt virt-install bridge-utils

参考サイトに従って確認します。

    lsmod ' grep kvm
    kvm_intel       138567  0
    kvm             441119  1 kvm_intel

そして、実行します。

    # systemctl start libvirtd 
    # systemctl enable libvirtd 

### ブリッジネットワークの設定

この部分については、

[Linux KVMホストのネットワーク設定-CentOS 7(Linux KVMホストのネットワーク設定-CentOS 7)](http://www.torutk.com/projects/swe/wiki/Linux_KVM%E3%83%9B%E3%82%B9%E3%83%88%E3%81%AE%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E8%A8%AD%E5%AE%9A-CentOS_7)

こちらを参考にしています。

    # nmcli c delete enp3s0
    # nmcli c add type bridge autoconnect yes con-name br0 ifname br0
    # nmcli c modify br0 bridge.stp no
    # nmcli c add type bridge-slave autoconnect yes con-name enp3s- ifname enp3s0 master br0
    # nmcli c modify br0 ipv4.method manual ipv4.addresses "192.168.1.10/24 192.168.1.1" ipv4.dns 8.8.8.8

このような感じになります。

ホスト側についてはこれで完了です。

### 仮想マシンの作成

Server Worldを参考にして、コマンドでやります。

    # mkdir -p /var/kvm/images 

    # virt-install \
    --name centos7 \
    --ram 2048 \
    --disk path=/var/kvm/images/centos7.img,size=30 \
    --vcpus 2 \
    --os-type linux \
    --os-variant rhel7 \
    --network bridge=br0 \
    --graphics none \
    --console pty,target_type=serial \
    --location 'http://mirrors.sonic.net/centos/7/os/x86_64/' \
    --extra-args 'console=ttyS0,115200n8 serial'

これで仮想マシンが作成されて、ネットインストールでCentOS7をセットアップしていきます。

回線が遅く、最初のダウンロードにかなり時間がかかりましたが、完了後はVNCかテキストでインストーラーが操作できるようになります。 テキスト版を選択してやってみましたが、設定する内容は同じなので操作に慣れてしまえば特に問題はありません。

インストールが完了してenterを押すと、再起動されてCentOS7が立ち上がりログインできるようになります。全てsshでやっていて何かが切り替わった感じもなくしれっとloginとか出ますので、なんか仮想マシンが動いている実感がありません。

ctrl+]でホスト側に切り替わり、ホストでの仮想化関連の操作は、virshコマンドなどで行うことになります。

とりあえず最低限の設定まで行った状態のものをクローンして、他の環境を作るときのひな形として取っておきます。