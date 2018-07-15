---
layout: post
title: CentOS7にsambaをインストール
date: 2015-03-02
tags: ["CentOS"]
---

### インストール

    # yum install samba samba-client samba-common

### 設定

    # vim /etc/samba/smb.conf

    workgroup = WORKGROUP  #変更
    max protocol = SMB2 #追加
    security = user
    passdb backend = tdbsam
    map to guest = Bad User #追加

    #以下追加
    [share]
        path = /home/share
        writable = yes
        guest ok = yes
        guest only = yes
        create mode = 0777
        directory mode = 0777
        share modes = yes

### ディレクトリ作成

    # mkdir -p /home/share
    # chmod -R 0777 /home/share
    # chown -R nobody:nobody /home/share

### 起動

    # systemctl enable smb.service
    # systemctl enable nmb.service
    # systemctl restart smb.service
    # systemctl restart nmb.service

### ファイアウォール

    # firewall-cmd --permanent --zone=public --add-service=samba
    # firewall-cmd --reload

※selinuxはdisableにしてあります。