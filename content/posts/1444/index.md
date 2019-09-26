---
layout: post
title: Entity Framework CoreのLazy Loading
date: 2016-08-10
tags: ["CSharp","Entity Framework Core"]
---

Entity Frameworkは以前から興味があって、隙間を見つけてどういう風に使って、どういう風に動くのか調べてたのですが、途切れ途切れになったままCoreになってしまったので、また試してみました。

大体データベースを扱う場合は、何らかデータがリレーションしていたりして、親子になってるテーブルなんかは普通に出てきます。そういうのを単純なモデルにするとこうなります。

```csharp
public class Order
{
    public int OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public List<OrderDetail> OrderDetails { get; set; }
}
public class OrderDetail
{
    public int OrderDetailId { get; set; }
    public stirng ProductCode { get; set; }
    public int Amount { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; }
}
```

これで、Order-OrderDetailで親子になるようなテーブルができてくれます。

データをセットするときは、

```csharp
var context = SampleDbContext();
context.Order.Add(
    new Order
    {
        OrderDate = DateTime.Now,
        OrderDetails = new List<OrderDetails>
        {
            new OrderDetail
            {
                ProductCode = "A001",
                Amount = 1
            }
        }
    });
context.SaveChanges();
```

こんな感じで普通にC#でオブジェクトを扱うようにすれば、よしなにしてくれます。

データを取得する場合は、

```csharp
var context = SampleDbContext();
var orders = context.Orders;
foreach (var order in orders)
{
    Console.WriteLine($"{order.OrderId},{order.OrderDate}");
    foreach (var detail in order.OrderDetails)
    {
        Console.WriteLine($"{detail.ProductCode},{detail.Amount}");
    }
}
```

とかやると、もうSQLのことを何も考えず、JOINとか気にする必要なくデータが出る......と思いきや、order.OrderDetailsの中身がnullになっててエラーになります。

前やってみたときはこれでさくっと出て、いたく感動したものですが、なんか思った通りに行きません。モデルもきわめて単純だし、データをのぞいてみてもちゃんと入ってるのに......

で、回答はここにありました。

[Part 2. Entity Framework Core 1.0 の基本的な使い方](https://blogs.msdn.microsoft.com/nakama/2016/07/07/aspnetcore10-part2/)

こちらの下の方にある「Lazy Loadingの廃止」というところが参考になりました。

前に行けていたように思えていたのは、Lazy LoadingでEFがあとから引っ張ってきてくれていたおかげなんですね。

```csharp
var orders = context.Orders
    .Include(o => o.OrderDetails);
```

こうすると子のデータも取れるようになりました。

もしOrderDetailがさらにリストを持っているような場合は、

```csharp
var orders = context.Orders
    .Include(o => o.OrderDetails)
        .ThenInclude(d => d.DetailSubItems);
```

みたいに、ThenIncludeをつないでいくことになります。

また、Orderが複数のリストを持つような場合は、

```csharp
var orders = context.Orders
    .Include(o => o.OrderDetails)
        .ThenInclude(d => d.DetailSubItems)
    .Include(o => o.Items);
```

みたいにして、Includeを繋げれば取ってこれます。

Entity Frameworkについてはググると以前のバージョンについての話と、Coreについての話がぱっと見てわかりづらいのでなかなか調べるのもなかなか大変ですね。