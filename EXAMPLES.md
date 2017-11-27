```yuml:class
[Customer|-forname:string;surname:string|doShiz()]<>-orders*>[Order]
[Order]++-0..*>[LineItem]
[Order]-[note:Aggregate root{bg:wheat}]
```
```yuml:activity
(start)->|a|
|a|->(Make Coffee)->|b|
|a|->(Make Breakfast)->|b|
|b|-><c>[want more coffee]->(Make Coffee)
<c>[satisfied]->(end)
```
```yuml:usecase
[Customer]-(Sign In)
[Customer]-(Buy Products)
(Buy Products)>(Browse Products)
(Buy Products)>(Checkout)
(Checkout)<(Add New Credit Card)
```
