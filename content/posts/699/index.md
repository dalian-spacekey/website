---
layout: post
title: GitLab -reconfigureの時、ruby_block[supervise_redis_sleep] action runで固まる件
date: 2014-11-16
tags: ["GitLab"]
---

GitLab環境を作ってみようと色々試してみているのですが、こいつがなかなか手強いです。
インストールしては色々触っては再インストールして......を繰り返していたら、gitlab-ctl reconfigureの時に、

    ruby_block[supervise_redis_sleep] action run

のところで固まったまま初期設定ができなくなる自体に陥りました。
色々調べてもなかなかこれといった答えがなく試行錯誤していたのですが、

[https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md#reconfigure-freezes-at-ruby_block-supervise_redis_sleep-action-run](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md#reconfigure-freezes-at-ruby_block-supervise_redis_sleep-action-run)

ここにヒントがありました。

gitlab-runsvdirを常駐させるみたいな解決策が書いてあるのですが、自分の環境でsystemctlで確認して見たらすでに起動していて、かつ自動起動する状態でした。
とりあえずsystemctl disableで自動起動しないようにして、再起動してから試したら大丈夫でした。

仕組みもよくわかってないので、これが解決策なのかはわからないのですが、一応メモ。

※環境は、CentOS7とgitlab-7.4.3_omnibus.5.1.0.ci-1.el7.x86_64.rpmでインストールしたGitLabを使ってます。