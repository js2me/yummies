# string()
Converts arbitrary input into a string representation.

Objects are serialized with `JSON.stringify`, optionally pretty-printed, and
nullish values resolve to the configured fallback.

**Examples:**

```ts
string(123); // '123'
```

```ts
string({ id: 1 }, { prettyJson: true });
```
