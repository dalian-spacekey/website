---
layout: post
title: .NET/C#でAmazonS3とデータをやりとりする
date: 2018-02-13
tags: ["CSharp"]
---

NuGetで[AWSSDK.S3](https://www.nuget.org/packages/AWSSDK.S3/)をインストール。

---

* AccessKeyとSecretAccessKeyはAmazonの設定
* RegionEndPointはS3のリージョンを指定
* BucketNameは作ったBucketの名前
* Keyはファイル名とか

`gist:dalian-spacekey/3a4b73de20a4f02babd7ab30959544d6`