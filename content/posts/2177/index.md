---
title: "[HUGO].Siteの中身がどうなってるか調べてみる"
date: "2019-09-28 0:00:00"
tags: ["Hugo"]
type: "hugobench"
layout: "site"
---

サイト生成時に扱われるデータがどうなってるのかドキュメントを見ながら、実際に取得してみた情報を整理してみます。  
とりあえず.Siteについて調べてみました。

<!--more-->

素材はこのサイトです。[dalian-spacekey/website](https://github.com/dalian-spacekey/website)

## 参考ドキュメント

* [Site Variables](https://gohugo.io/variables/site/)
* [Configure Hugo](https://gohugo.io/getting-started/configuration/)
* [Menu Entry Properties](https://gohugo.io/variables/menus/)
* [Taxonomies](https://gohugo.io/content-management/taxonomies/)

## .Site

名前の通り、サイト全体の情報がとれます。  
単一の値が返ってくるものと、配列やマップが返ってくるものがあります。  
いくつかの値は、config.tomlで指定した値がそのまま出てきます。

このサイトの現状の.Siteの中身をそのまま出力してみました。  
