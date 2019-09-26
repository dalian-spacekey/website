---
layout: post
title: アナグラム
date: 2015-05-28
tags: ["CSharp"]
---

[コミュ力よりも技術力！？FizzBuzz の変わりとなる5つのテストが提案される(ソフトアンテナブログ)](http://www.softantenna.com/wp/software/fizzbuzz-alternatives/)

> 2つの引数を取り、引数がアナグラム(どちらも全く同じ文字を含んでいる)ならばtrueを、そうでないならばfalseを返す関数をかけ。

C#だったらこんなのありかな？

    Func<string, string, bool> anagram = (s1, s2) => 
        s1.ToUpper().ToArray<char>().OrderBy(x => x)
            .SequenceEqual(s2.ToUpper().ToArray<char>().OrderBy(x => x));
    