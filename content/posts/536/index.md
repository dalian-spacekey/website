---
layout: post
title: jQueryでスライドショー
date: 2013-08-15
tags: ["JavaScript"]
---

例えばこんな感じにしておいて、

    <div id="slides">
      <div>1枚目</div>
      <div>2枚目</div>
      <div>3枚目</div>
    </div>

スクリプトにこう書けば、

    window.onload = function () {
      var i = 0;
      var list = [];

      list = $('#slides').find('div');

      $(list[0]).fadeIn(1000);

      setInterval(function () {
        $(list[i]).hide();
        if (i < list.length - 1)
          i++;
        else
          i = 0;

        $(list[i]).fadeIn(1000);
      }, 3000);
    };

お手軽に、フェードイン/アウトをするスライドショーの出来上がり。