# createPubSub()
Creates a simple publish-subscribe dispatcher that stores the last published
arguments and allows subscription management.

**Examples:**

```ts
const pub = createPubSub<[string]>();
pub('ready');
```

```ts
const pub = createPubSub<[number]>();
const unsub = pub.sub((value) => console.log(value));
```
