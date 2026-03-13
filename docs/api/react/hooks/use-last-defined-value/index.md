# Use Last Defined Value

### useLastDefinedValue()
Remembers and returns the last non-nullish value passed to the hook.

**Examples:**

```ts
const title = useLastDefinedValue(props.title);
```

```ts
const user = useLastDefinedValue<User | null>(selectedUser);
```

