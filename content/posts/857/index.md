---
layout: post
title: CentOS7でHDDを増設する
date: 2015-03-02
tags: ["CentOS"]
---

128G-SSD、500GB-HDD、1TB-HDDの構成の機械にCentOS7をインストールしましたが、とりあえずSSDをインストール先として、HDDについてはインストール段階では無視して進めたので、それらのHDDを使えるように、しかも見た目上はディスクの違いを区別しなくて良いように、LVMでセットアップします。

500GBの方は/dev/sdb1で認識されていて、これを/homeに、1TBの方は/dev/sdc1で認識されていて、これを/にくっつけてみました。  
下記は500GBの作業です。

### <span style="line-height: 1.5;">PV(Physical Volume)を作成</span>

    # pvcreate /dev/sdb1
    WARNING: ntfs signature detected on /dev/sdb1 at offset 3. Wipe it? [y/n] y
     Wiping ntfs signature on /dev/sdb1.
    WARNING: dos signature detected on /dev/sdb1 at offset 510. Wipe it? [y/n] y
     Wiping dos signature on /dev/sdb1.
     Physical volume "/dev/sdb1" successfully created 

### VG(Volume Group)にPVを追加

    # vgextend centos /dev/sdb1
     Volume group "centos" successfully extended

### VGの状態を確認

Physical volumesにsdb1が追加されています。

    # vgdisplay -v centos
     Using volume group(s) on command line
     Finding volume group "centos"
     --- Volume group ---
     VG Name centos
     (省略)
     --- Physical volumes ---
     (省略)
     PV Name /dev/sdb1
     PV UUID Wq3h04-kAX2-t461-EGS5-0Kwo-lepq-hCfgtK
     PV Status allocatable
     Total PE / Free PE 119234 / 119234

### LV(Logical Volume)を拡張

     # lvextend -l +100%FREE /dev/centos/home
     Extending logical volume home to 521.17 GiB
     Logical volume home successfully resized

### VGの状態を確認

     # vgdisplay -v centos
     (省略)
     --- Logical volume ---
     LV Path /dev/centos/home
     LV Name home
     VG Name centos
     LV UUID vgFX0e-3lM9-2Pam-SEQZ-XUiK-yzZ2-IUAbwK
     LV Write Access read/write
     LV Creation host, time localhost, 2015-03-02 01:22:36 +0800
     LV Status available
     # open 1
     LV Size 521.17 GiB
     Current LE 133420
     Segments 2
     Allocation inherit
     Read ahead sectors auto
     - currently set to 256
     Block device 253:2
     (省略)

### dfで確認

この時点ではまだfsには反映されていません。

     # df -h
    /dev/mapper/centos-home 56G 33M 56G 1% /home

### ファイルシステムに反映

    # xfs_growfs /dev/centos/home
    meta-data=/dev/mapper/centos-home isize=256 agcount=4, agsize=3631616 blks
     = sectsz=512 attr=2, projid32bit=1
     = crc=0
    data = bsize=4096 blocks=14526464, imaxpct=25
     = sunit=0 swidth=0 blks
    naming =version 2 bsize=4096 ascii-ci=0 ftype=0
    log =internal bsize=4096 blocks=7093, version=2
     = sectsz=512 sunit=0 blks, lazy-count=1
    realtime =none extsz=4096 blocks=0, rtextents=0
    data blocks changed from 14526464 to 136622080

### dfで確認

/homeが拡張されました。

    # df -h
    /dev/mapper/centos-home 522G 34M 522G 1% /home

&nbsp;

同様の方法で、1TBの方も作業をして、無事全てのディスクを活用できる体制ができました。