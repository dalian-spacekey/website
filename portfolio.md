# 開発実績

## インデックス

1. データエントリシステム
2. 飛行記録管理システム
3. 証票管理システム
4. 美容機器サポートシステム
5. 歯科画像/診断書管理システム
6. 英語教室管理システムその他
7. 回線工事作業管理システム
8. 教育系動画配信サービス(デモシステム)
9. 多店舗展開ポイントカードシステム(APIサーバー側)
10. その他

## 1. データエントリシステム

### 概要

入力対象の帳票画像を送信し、事前に定義したワークフローに従い、項目ごとの画像分割、OCR、オペレータによる入力/チェックを行ってゆき、テキストデータを生成するシステム。
オペレータは、WebUIもしくはiOS/Androidアプリでダウンロードしてデータエントリやチェックを行う。

### 利用技術

* ASP.NET Core 3.1
* Vue: Nuxt, TypeScript
* Xamarin Forms: iPhone, Android
* Azure: App Service, Functions, CosmosDB, SQLDatabase, Storage

総合的なデータはCosmosDBで管理し、FunctionsのTriggerによりワークフローが流れていく仕組み。
これの前身となるシステムを.NET Core 2.0時代に、CentOS+DockerとMySQL、モバイルなしで作っていたものを、新しい技術で一から作り直したもの。

## 2. 飛行記録管理システム

### 概要

手書きの飛行記録画像をアップロード、テキストデータ化して管理するシステム。
また、機材やパイロットの管理などを行える機能もあったが使わずじまい。

### 利用技術

* ASP.NET Core 3.1
* Vue : Nuxt, TypeScript
* Azure: App Service, CosmosDB, Storage

オーソドックスなWebを使った業務管理システム。
テキストデータ化は上記のデータ入力システムに画像を送信、結果を受信するような連携を行っている。

## 3. 証票管理システム

### 概要

領収書やレシートの画像をアップロードし、日付・金額・摘要をテキスト
データ化して管理するシステム。その結果をCSVやJSONなどで出力し、
他の会計システムなどに連携できるようにするために開発。

### 利用技術

* ASP.NET Core 3.1
* Vue : Nuxt, TypeScript
* Azure: App Service, CosmosDB, Storage

飛行記録管理システムのバリエーション。


## 4. 美容機器サポートシステム

### 概要

美容院などに販売した美容機器のサポートを行うシステム。
販売する機器一式にiPod touchが含まれており、そこにあらかじめインストールされているアプリを使い、写真や動画を撮影して販売元から利用方法等のサポートを行うシステム。
販売元はWebUIで各販売先からくるサポート依頼に対応する。

### 利用技術

* ASP.NET Core 3.1
* Vue : Nuxt, TypeScript
* Xamarin Forms: iOSのみ
* Azure: App Service, CosmosDB, Storage

もともと.NET Core 2.0ぐらいに、データベースはSQLDatabase、WebはAngular4で作っていたが、プロジェクトが数年止まったあと再起動されたので、サーバーとWebを作り直した。


## 5. 歯科画像/診断書管理システム

### 概要

歯科医院で使われる、特殊なレンズをiPod touchのカメラに装着して撮影された患部の画像を管理するシステム。
iPodアプリで写真を撮影して管理サーバーに送信し、別途Windowsのデスクトップアプリで患者情報や診断書を作成する形式。

### 利用技術

* ASP.NET Core 3.1
* WPF: .NET Framework4.8
* Xamarin Forms: iOSのみ
* Azure: App Service, SQLDatabase, Storage

これも.NET Core 2.0時代に作ったものだったが、途中で3.1で作り直した。


## 6. 英語教室管理システムその他

### 概要

英語教室の生徒やクラスなどを管理し、生徒への情報提供やクラスへの参加をサポートするシステム一式。
管理者が使う業務システム、生徒が教室にチェックイン(QRコード利用)したり出席状況などを確認するモバイルアプリ、オンラインクラスのスケジュールや参加をサポートするWebシステムなどから構成される。
また、教室のウェブサイトも対応。

### 利用技術

* ASP.NET Core 3.1
* Angular4
* Vue: Nuxt, TypeScript
* Xamarin Forms: iPhone/Android, iPad
* Azure: App Service, MySQL, Storage

.NET Core 2.0時代に、さくらVPS上のCentOS+Dockerでの運用にチャレンジしたところからスタート。
昨年3.1に変更するとともにAzureに移行したが、管理システムのAngularがまだ棚上げ状態。
ウェブサイトについてはデザインだけをよそのデザイナーが行い、Vueで実装を行った。


## 7. 回線工事作業管理システム

### 概要

回線工事を行う業者の、現地作業を記録して管理するシステム。
タブレットPCにインストールされたWindowsアプリで、タブレットのカメラによる施工写真の撮影、インターフェースの切り替えや開通試験を行う機能、ドローツール風に図面を作成する機能がある。
また、管理者が各種状況を把握するためのモバイルアプリもある。
サーバーは顧客側担当。

### 利用技術

* WPF: .NET Framework4.8
* Xamarin Forms: iOS/Android


## 8. 教育系動画配信サービス(デモシステム)

### 概要

教育用のショートムービーを登録して、ユーザーに閲覧/ダウンロードを提供するシステム。
こういったことができますよ的なデモシステムのため、動画部分はストリーミングなどはしておらずストレージのmp4を出しているだけ、データの登録はデータベース直など。

### 利用技術

* ASP.NET Core 6.0
* Blazor Server
* Azure: App Service, CosmosDB, Storage

本運用するシステムではないため、技術リサーチの材料。


## 9. 多店舗展開ポイントカードシステム(APIサーバー側)

### 概要

参加店舗で使えるポイントカードアプリのサーバー側。

### 利用技術

* CentOS
* PHP: Slim Framework
* MySQL

## 10. その他

下記は一部参加。

* 包装資材会社の業務システム(見積/受発注/在庫管理): PHP+MySQL
* 病院手術情報管理システム: JavaScript, SQLServer
* タクシー配車アプリ: Xamarin.Forms(iOS/Android)
