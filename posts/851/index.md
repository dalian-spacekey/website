---
layout: post
title: CentOS7にNTFSフォーマットされたUSB HDDをマウント
date: 2015-03-02
tags: ["CentOS"]
---

サーバーに保管しておきたいファイルをネットワーク経由だと時間がかかるので、USBのHDDからコピーしようとしたら、HDDがNTFSフォーマットだったのでさくっとマウントできませんでした。

### インストール

    # yum install epel-release
    # yum install ntfs-3g

### マウント

    # mount -f ntfs /dev/sdc1 /mnt

### アンマウント

あれこれコピーしたあとunmountの時、「使用中」だといってアンマウントできませんでした。

    # umount -l /mnt

と言う風に-lをつけるとアンマウントできます。