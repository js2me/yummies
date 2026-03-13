# Create Ref

### RefChangeListener
You can return `false` if you don't want to change the value in this ref


### Ref
Alternative to React.createRef but works in MobX world.
Typically it the should be the same React.LegacyRef (fn style)


### CreateRefConfig
_No description._


### createRef()
Creates a MobX-aware ref that behaves like a callback ref and exposes
observable `current` and `meta` fields.

**Example:**

```ts
```ts
const inputRef = createRef&lt;HTMLInputElement&gt;();
inputRef.set(document.createElement('input'));
```

```ts
const nodeRef = createRef(`
  onUnset: () =&gt; console.log('detached'),
  meta: { mounted: false `,
});
```
```


### isRef()
Checks whether the provided value is a ref created by `createRef`.

**Example:**

```ts
```ts
const ref = createRef&lt;number&gt;();
isRef(ref); // true
```

```ts
isRef(` current: 1 `); // false
```
```


### toRef()
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

