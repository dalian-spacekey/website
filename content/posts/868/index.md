---
layout: post
title: Oracle12cにC#+ODP.NETで接続する
date: 2015-03-08
tags: ["Oracle"]
---

業務でOracle12cを使うことになったので、セットアップとか色々調べながらやっておりました。  
言語がC#と言うことで、まずはOleDB接続するコードでサンプル的なものを同僚に作ってもらっていたのですが、私の環境だとどうしても「ORA-01019」が出て接続できない......  
クライアントに関係するものを色々インストールしたり設定したり、はたまた権限やらなにやら設定を変えまくってやっていたんですが、やっぱりどうしてもORA-01019......結局何が原因かわからないまま手詰まりのままです。

で、代わりにODP.NETで接続してみたらあっさりOK。

NugetでOracle Data Provider for .NET(ODP.NET)をインストール。

    using Oracle.ManagedDataAccess.Client; 

    var conne = new OracleConnection(); 
    connection.ConnectionString = 
       "user id=user;password=pass;data source=(DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=192.168.1.1)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=orcl)))"; 
    connection.Open();

これだけ。  
instant clientやら他のドライバを一切入れることなくつながります。

実際のプロジェクトではどの方式で接続するかまだわからないのですが、クライアントにインストールの手間がないことを考えるとODP.NETの方が楽ですね。  
  