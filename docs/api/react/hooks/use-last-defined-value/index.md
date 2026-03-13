# Use Last Defined Value

### useLastDefinedValue()
Remembers and returns the last non-nullish value passed to the hook.

**Example:**

```ts
```ts
const title = useLastDefinedValue(props.title);
```

```ts
const user = useLastDefinedValue&lt;User | null&gt;(selectedUser);
```
```

