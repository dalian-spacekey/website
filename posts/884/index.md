---
layout: post
title: CsvHelperによるCSVマッピング
date: 2015-05-21
tags: ["C#"]
---

あるプロジェクトで、CSVによるデータのやりとりがあり[CsvHelper](http://joshclose.github.io/CsvHelper/)を使いましたが、読み書きの部分だけを使ってMapping機能は使わなかったので、今後のためにどういう動きをするのか確認して見ました。  

 なかなか便利なので、次にCSVを扱う時には活用してみたいですね。

#### ポイント

# CsvClassMapを使って、マッピング定義のクラスを作成する。  

 # Reader/Writerにマッピング定義したクラスを指定する  

 # CSVとデータクラス間で変換が必要な場合はDefaultTypeConverterを継承したコンバータを作ってマッピング定義で指定する

#### 読み込み時

たとえばこんな感じになります。

    class Program
    {
        static void Main(string[] args)
        {
            using (var reader = new CsvReader(new StreamReader("sample.csv")))
            {
                reader.Configuration.HasHeaderRecord = false;
                reader.Configuration.RegisterClassMap();

                var records = reader.GetRecords();

    	    try
    	    {
    	        foreach (var record in records)
    		{
                        Console.WriteLine("{0}/{1}/{2}",
                            record.Id,
                            record.Name,
                            record.Section
                        );
    		}
    	    }
    	    catch (Exception ex)
    	    {
    	        Console.WriteLine(ex.Message);
    	        Console.WriteLine(ex.Data["CsvHelper"]);
    	    }
    	}
        }
    }

    class MyClass
    {
        private int id;
        public int Id
        {
            get
            {
                return id;
            }
            set
            {
                if (value > 10)
                {
                    throw new Exception("IDは10までです");
                }
                else
                {
                    id = value;
                }
            }
        }

        private string name = "";
        public string Name
        {
            get
            {
                return name;
            }
            set
            {
                if (value.Length > 10)
                {
                    throw new Exception("nameが長すぎます");
                }
                else
                {
                    name = value;
                }
            }
        }

        private int section = 0;
        public int Section
        {
            get
            {
                return section;
            }
            set
            {
                section = value;
            }
        }

    }

    class MyClassMap : CsvHelper.Configuration.CsvClassMap
    {
        public MyClassMap()
        {
            Map(m => m.Id).Index(0);
            Map(m => m.Name).Index(1);
            Map(m => m.Section).Index(2).TypeConverter();
        }
    }

    class MyConverter : CsvHelper.TypeConversion.DefaultTypeConverter
    {
        public override object ConvertFromString(CsvHelper.TypeConversion.TypeConverterOptions options, string text)
        {
            switch (text)
            {
                case "zero":
                    return 0;
                case "one":
                    return 1;
                case "two":
                    return 2;
                default:
                    return -1;
            }
        }

        public override string ConvertToString(CsvHelper.TypeConversion.TypeConverterOptions options, object value)
        {
            int intvalue;
            if (int.TryParse(value.ToString(), out intvalue))
            {
                switch (intvalue)
                {
                    case 0:
                        return "zero";
                    case 1:
                        return "one";
                    case 2:
                        return "two";
                    default:
                        return "none";
                }
            }
            else
            {
                return "none";
            }
        }

        public override bool CanConvertFrom(Type type)
        {
            return type == typeof(string);
        }
    }

CSV

    1,Red,zero
    2,Blue,one
    3,Green,two
    4,Yellow,three
    5,Pink,four

実行結果

    1/Red/0
    2/Blue/1
    3/Green/2
    4/Yellow/-1
    5/Pink/-1

CSV

    1,Red,zero
    2,Blue,one
    3,Green,two
    4,Yellow,three
    X,Pink,four

実行結果

    1/Red/0
    2/Blue/1
    3/Green/2
    4/Yellow/-1
    The conversion cannot be performed.
    Row: '5' (1 based)
    Type: 'ConsoleApplication1.MyClass'
    Field Index: '0' (0 based)
    Field Value: 'X'

CSV

    1,Red,zero
    2,Blue,one
    3,Green,two
    4,Yellow,three
    5,Pink5678901,four

実行結果

    1/Red/0
    2/Blue/1
    3/Green/2
    4/Yellow/-1
    nameが長すぎます
    Row: '5' (1 based)
    Type: 'ConsoleApplication1.MyClass'
    Field Index: '1' (0 based)
    Field Value: 'Pink5678901'

CSV

    1,Red,zero
    2,Blue,one
    3,Green,two
    4,Yellow,three
    11,Pink,four

実行結果

    1/Red/0
    2/Blue/1
    3/Green/2
    4/Yellow/-1
    IDは10までです
    Row: '5' (1 based)
    Type: 'ConsoleApplication1.MyClass'
    Field Index: '0' (0 based)
    Field Value: '11'

TypeConverterを指定しておけば、CSVとクラス側の内容が違う場合でも吸収してくれます。プロパティで制約を書いておけば例外で捕まえられますし、例外の内容をパースしてやれば、どこで出たのかもわかりますね。

#### 書き出し

読込と同じようにRegisterClassMapするだけです。  

 MyConverterで双方向に変換するように書いてあるので、Sectionもちゃんとoneと出るようになります。

    List list = new List();
    list.Add(new MyClass() { Id = 1, Name = "Black", Section = 1 });

    using (var writer = new CsvWriter(new StreamWriter(@"c:\work\sample\samplew.csv")))
    {
        writer.Configuration.HasHeaderRecord = false;
        writer.Configuration.RegisterClassMap();
        writer.WriteRecords(list);
    }

結果

1,Black,one

### まとめ

CSVは外部との連携する際はよく使われるんですが、データが想定したとおりに入っていない場合も多々あり、チェックだ変換だと何かと手数が増えますね。string配列だけで扱っていると、いったい何のデータを操作しているのかわかりづらくなりますので、こういった方法で業務ロジック部分が汚染されないようにかけるとストレスも減っていいでしょう。

マッピングの際は、TypeConverter以外にも、値が指定されない場合のデフォルト値(Default)や、もうちょっと柔軟に変換ができるConvertUsingというメソッドもあります。

上記のサンプルではヘッダなしのCSVを扱っていますが、ヘッダが付いていればIndex(0)ではなく、Name("fieldname")のように名前で指定もできますし、そもそもIndexもNameも指定しなければ、Mapを設定した順番に前のフィールドからマッピングしてくれます。  

 インデックスを意識しなくてよくしておけば、仕様変更とかコーディングミスのせいで泣きながら一個ずつインデックスを書き直さなくてもいいですね。

あと、Reference Mapという機能を使えば、

    class MyClass
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Address Address { get; set; }
    }
    class Address
    {
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
    }

こういうクラス構成になっている場合でも処理できます。

    class MyClassMap : CsvHelper.Configuration.CsvClassMap
    {
        public MyClassMap()
        {
            Map(m => m.Id);
            Map(m => m.Name);
            References(m => m.Address);
        }
    }
    class AddressMap : CsvHelper.Configuration.CsvClassMap＜Address＞
    {
        public AddressMap()
        {
            Map(m => m.Street);
            Map(m => m.City);
            Map(m => m.State);
            Map(m => m.Zip);
        }
    }

マッピングはこういう風になり、

    Id,Name,Street,City,State,Zip

というCSVとやりとりすることになります。  

 便利ですね。