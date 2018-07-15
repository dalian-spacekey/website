---
layout: post
title: TABLESPACEの確認と作成
date: 2015-06-05
tags: ["Oracle"]
---

Oracleを使っているプロジェクトで、データベースを再構築したときにTABLESPACEの作り方を忘れてしまっていたのでメモ。

### TABLESPCEの確認

    SELECT * FROM DBA_TABLESPACES;

    TABLESPACE_NAME                BLOCK_SIZE INITIAL_EXTENT (以降略)
    ------------------------------ ---------- --------------
    SYSTEM                               8192          65536
    SYSAUX                               8192          65536
    UNDOTBS1                             8192          65536
    TEMP                                 8192        1048576
    USERS                                8192          65536

### データファイルの確認

    SELECT * FROM DBA_DATA_FILES;

    FILE_NAME                                       FILE_ID TABLESPACE_NAME (以降略)
    -------------------------------------------- ---------- ----------------
    /usr/oracle/app/oradata/orcl2/users01.dbf             4 USERS           
    /usr/oracle/app/oradata/orcl2/undotbs01.dbf           3 UNDOTBS1        
    /usr/oracle/app/oradata/orcl2/sysaux01.dbf            2 SYSAUX          
    /usr/oracle/app/oradata/orcl2/system01.dbf            1 SYSTEM                  

### TABLESPACEの作成

    CREATE TABLESPACE "INDEX"
      DATAFILE '/usr/oracle/app/oradata/orcl2/index.dbf' size 100M
      SEGMENT SPACE MANAGEMENT AUTO;           
    