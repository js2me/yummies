# toRef()
Normalizes a plain value or an existing ref into a `Ref` instance.

**Example:**

```ts
```ts
const ref = toRef(document.body);
ref.current === document.body;
```

```ts
const existingRef = createRef&lt;number&gt;();
const sameRef = toRef(existingRef);
```
```
