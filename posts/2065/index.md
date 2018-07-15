---
layout: post
title: Karabiner-Elementsで1キーでかなと英数をトグルする
date: 2017-10-11
tags: ["Mac"]
---

※追記(2017/11/10)

11.2から、input_source_ifやinput_source_unlessというパラメータが増えて、もっとスマートにトグル切り替えできるようになりました。

[https://github.com/pqrs-org/KE-complex_modifications/blob/master/docs/json/example_input_source.json](https://github.com/pqrs-org/KE-complex_modifications/blob/master/docs/json/example_input_source.json)

* * *

長らくWindowsでは右AltでIMEを切り替えていたので、Macを使うようになってからはKarabinerでも同じような設定にしてましたが、Sierraになってからは使えなくなり、「英かな」とか「前の入力ソース」のショートカットを組み合わせたりとかしてしのいでいたんですが、これが微妙にレスポンスがよくなかったりしたので若干ストレスになってました。

最近、Karabiner-ElementsのComplex Modificationsで設定がサクッとダウンロードできるようになってたので、ちょっと日本語入力の切り替え癖を矯正してみようかと、Macの日本語キーボード的な英数とかなキーの設定にしてました。

が、なんかたまたま、Karabiner-Elementsの[リリースノート](https://github.com/tekezo/Karabiner-Elements/blob/f38edd91f6d8b0f2351535b163e54b249e89f960/NEWS.md)を見ていたら、Version 0.91.9のところに"variable_if"とか"set-variable"などというものを発見。
(英語だしちゃんと見てなかった)

これ、切り替えたステータスを保持しておいたら、ToggleIME的なことができるんじゃないのかと思って英数・かなキーのjsonを書き換えてやってみましたら、びっくりしたことになんかそれっぽく動いてます。

[Karabiner-Elementsで1キーでかなと英数をトグルするサンプル](https://gist.github.com/dalian-spacekey/08e2cae57f86b702f34400ef7f02b82c)

`gist:dalian-spacekey/08e2cae57f86b702f34400ef7f02b82c`

見たらわかるとおり、imemodeが0か1かでjapanese_eisuuを送り出すか、japanese_kanaを送り出すかだけ。
サンプル見て真似して書いただけなので、ちゃんとした書き方なのかとかシチュエーションによってはだめなケースがあるのかよくわかりませんけど、なんかまあ一応それっぽい感じ。