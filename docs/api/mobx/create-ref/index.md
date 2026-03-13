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

**Examples:**

```ts
const inputRef = createRef<HTMLInputElement>();
inputRef.set(document.createElement('input'));
```

```ts
const nodeRef = createRef({
  onUnset: () => console.log('detached'),
  meta: { mounted: false },
});
```


### isRef()
Checks whether the provided value is a ref created by `createRef`.

**Examples:**

```ts
const ref = createRef<number>();
isRef(ref); // true
```

```ts
isRef({ current: 1 }); // false
```


### toRef()
Normalizes a plain value or an existing ref into a `Ref` instance.

**Examples:**

```ts
const ref = toRef(document.body);
ref.current === document.body;
```

```ts
const existingRef = createRef<number>();
const sameRef = toRef(existingRef);
```

