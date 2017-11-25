# atom yUML generator

This extension will generate a UML diagram using [yUML](https://yuml.me/)'s syntax. You can draw [class](https://yuml.me/diagram/scruffy/class/samples), [activity](https://yuml.me/diagram/scruffy/activity/samples), and [use case](https://yuml.me/diagram/scruffy/usecase/samples) diagrams. yUML uses a stripped down UML markup designed to keep you on focus, rather than allowing you to get bogged down in the details of making the perfect UML diagram.

### howto

You can either select a section of text in a document, or use a whole document as a source for rendering a diagram. Triggering a render is done by pressing ```ctrl-alt-p``` and then typing ```Yuml Generator: Generate```, alternatively you can press ```ctrl-alt-y```.

The extension will work out what text you want to be parsed using the following rules:

- If text is selected, this will be used
- If the cursor is positioned between ` ```yuml` and ` ``` ` then the only that text will be selected
- If none of the above rules come into play, then the whole buffer will be sent

![image][screenshot]

[screenshot]:https://raw.githubusercontent.com/thejsninja/atom-yuml-generator/master/screenshot.png "Screenshot of yuml-generator in action"

### yUML syntax examples

#### class diagram

```yuml:class
[Customer|-forname:string;surname:string|doShiz()]<>-orders*>[Order]
[Order]++-0..*>[LineItem]
[Order]-[note:Aggregate root{bg:wheat}]
```

![image][classdiagram]

[classdiagram]:https://yuml.me/diagram/scruffy;dir:lr/class/%252F%252F+Cool+Class+Diagram%2C+%5BCustomer%7C-forname%3Astring%3Bsurname%3Astring%7CdoShiz()%5D%3C%3E-orders*%3E%5BOrder%5D%2C+%5BOrder%5D%2B%2B-0..*%3E%5BLineItem%5D%2C+%5BOrder%5D-%5Bnote%3AAggregate+root%7Bbg%3Awheat%7D%5D.svg "Example of rendered class diagram"

#### activity diagram

**nb:** activity diagrams are only in one style and direction.

```yuml:activity
(start)->|a|
|a|->(Make Coffee)->|b|
|a|->(Make Breakfast)->|b|
|b|-><c>[want more coffee]->(Make Coffee)
<c>[satisfied]->(end)
```

![image][activitydiagram]

[activitydiagram]: https://yuml.me/diagram/scruffy;dir:lr/activity/(start)-%3E%7Ca%7C%2C%7Ca%7C-%3E(Make+Coffee)-%3E%7Cb%7C%2C%7Ca%7C-%3E(Make+Breakfast)-%3E%7Cb%7C%2C%7Cb%7C-%3E%3Cc%3E%5Bwant+more+coffee%5D-%3E(Make+Coffee)%2C%3Cc%3E%5Bsatisfied%5D-%3E(end).svg "Example of rendered activity diagram"

#### use case diagram

**nb:** use case diagrams are only available going in one direction.

```yuml:usecase
[Customer]-(Sign In)
[Customer]-(Buy Products)
(Buy Products)>(Browse Products)
(Buy Products)>(Checkout)
(Checkout)<(Add New Credit Card)
```

![image][usecasediagram]

[usecasediagram]: https://yuml.me/diagram/scruffy/usecase/[Customer]-(Sign%20In),%20[Customer]-(Buy%20Products),%20(Buy%20Products)%3E(Browse%20Products),%20(Buy%20Products)%3E(Checkout),%20(Checkout)%3C(Add%20New%20Credit%20Card).svg "Example of rendered use case diagram"
