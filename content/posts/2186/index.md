---
title: "AWS Lambda + API Gateway + Pythonでお問い合わせフォームの裏側を作る"
date: "2020-02-11 0:00:00"
tags: ["AWS", "Lambda", "APIGateway", "Python"]
---

あるお客さんのサイト群の管理を引き受けることになり、そのうちの1つのサイトがWordpressなんだけどほぼスタティックなサイトだったので、Wordpressのサイトとしてまるごと移管するよりか、Vue(Nuxt)を使ってほぼスタティックなサイトにしてNetlifyにホスティングしたほうが軽いし、当面無料でいけそうということでサクッと作り替えました。

ただ、お問い合わせフォームが、単に管理者向けにメールするだけでなく、問い合わせ者にも送るようになっていたので、その部分の裏側だけはAWSに作ることにしました。

<!--more-->

## Pythonスクリプト

Pythonはこんな感じにしておきます。

{{<linkcard "https://github.com/dalian-spacekey/contact-form/blob/master/contact-form.py">}}

メールサーバーに接続して、問い合わせ者と管理者にそれぞれメールを送って終わり。入力値のチェックも省いていますし、何かエラーが出てもただ失敗した、となるだけの単純なものです。

POSTで下記のようなjsonを受け取ることを前提としています。

```json
{
    "name": "name",
    "furigana": "furigana",
    "company": "company",
    "email": "email",
    "tel": "tel",
    "category": "category",
    "content": "content"
}
```

メールサーバーなどの設定は、環境変数から取得する前提です。

## Lambda

LambdaをPythonで新規作成するだけです。

名前を入れてPython3.8を選択。

![contact1](contact1.png)

スクリプトをエディタに貼り付ける。

![contact2](contact2.png)

環境変数を下記のように設定。

![contact3](contact3.png)

タイムアウトがデフォルト3秒だと、メールサーバー接続から送信完了が終わらないので、30秒ぐらいにしとく。

![contact4](contact4.png)


## API Gateway

Lambdaだけだと外から呼べないので、実行してくれる役割になるAPI Gatewayを設定します。

コンソールでAPI Gatewayに行って、Create New。  
REST APIを選択。

![contact5](contact5.png)

API nameを何か入れてCreate API。

![contact6](contact6.png)

Create Resource。

![contact7](contact7.png)

Resource Nameを入力。  
これは、POSTするときのURLの最後に当たる部分の名前です。  
「https://.../stage/<ここ>」

![contact8](contact8.png)

Create Method

![contact9](contact9.png)

ツリーのところでPOSTを選んでから、Lambdaを作ったリージョンを選んで、作ったLambdaの名前を入力します。  
オートコンプリートが効くので、一部入力すると選べます。

![contact10](contact10.png)

そのあと、ActionsからEnable CORSを選んでEnable。  
必要であれば「Access-Control-Allow-Origin」に呼び出し元のトップレベルドメインまでを入力しておくと、そのサイトのコードからのみ送信できるようになります。

![contact11](contact11.png)

Deploy API。  
メソッドを作ったままではまだアクセスできるようになっていないので、デプロイします。

![contact12](contact12.png)

[New Stage]を選んで、Stage nameを入力します。
「https://.../<ここ>/resource」の名前になります。

![contact13](contact13.png)

deployすると、Invoke URLというのが出ます。  
これが、呼び出すときのbase urlになります。  
今回の場合、「https://xxxxx.us-east-1.amazonaws.com/production/contact-form」 をPOSTで呼び出すことになります。

![contact14](contact14.png)

その下に、スロットリングの設定がありますが、デフォルト10000とかになってます。
たまに受け付けるぐらいであれば、誤動作などで連発してややこしいことにならないように、少なくしといた方がいいでしょう。

![contact15](contact15.png)

## 終わり

これぐらいで、最低限メールを飛ばすだけの裏側ができました。  
安全のために入力内容をサーバー側でもチェックしたり、ログを出したり、テンプレートやメールアドレスを変更しやすくしたり、とか、もっと安定した運用に耐えるものにするためにはやることは色々ありますが、取り急ぎ置き換えるステップとしては十分な気がします。
