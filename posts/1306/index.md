---
layout: post
title: GitLabのサブディレクトリ設定
date: 2016-03-22
tags: ["GitLab"]
---

ソース管理に[GitLab](https://about.gitlab.com/)を使っていて、サブディレクトリで動く設定にしていますが、この設定、結構面倒くさいんです(ファイル4つ書き換える)。また、アップデート後のreconfigureでこの設定がなくなってしまい、gitlab.rbでも指定できないみたいなので、いつも手作業です。

さらに、GitLabは毎月確実にアップデートされていて、細かいリリースは逐次行われるので、うかうかしていると新しくなりすぎていてバージョンアップできるかどうかを結構気にしないといけないことにもなります。アップデート自体はyumでやってくれるんですが、サブディレクトリ設定は毎回ちゃんとやり直さないといけないのが大変です。

で、先ほどGitLabを最新にして、いつも通りにサブディレクト利用の設定を書き換えていたら、設定方法が変わってました。

基本的には、gitlab.yml,unicorn.rb,config.yml,application.rbの4つに手を入れるんですが、application.rbにあるはずの「config.relative_url_root = "/gitlab"」のコメント行がなくなっていました。

調べてみたら、[Install GitLab under a relative URL](http://doc.gitlab.com/ce/install/relative_url.html)こう言うことみたいです。

application.rbの設定は、relative_url.rbというファイルに書かないといけなくなったみたいですね。relative_url.rb.sampleには、「config.relative_url_root = "/gitlab"」と書いてあるので、このファイルが有効になっていれば読み込まれると言うことでしょう。

まとめるとこんな感じになります。(/gitlabで動かす場合)

    cp /opt/gitlab/embedded/service/gitlab-rails/config/initializers/relative_url.rb.sample \
       /opt/gitlab/embedded/service/gitlab-rails/config/initializers/relative_url.rb

    vim /var/opt/gitlab/gitlab-rails/etc/gitlab.yml
        relative_url_root: /gitlab のコメントアウト外す

    vim /var/opt/gitlab/gitlab-rails/etc/unicorn.rb
        ENV['RAILS_RELATIVE_URL_ROOT'] = "/gitlab" を追記

    vim /var/opt/gitlab/gitlab-shell/config.yml
        gitlab_url: "http://localhost:8080/gitlab" に書き換え
