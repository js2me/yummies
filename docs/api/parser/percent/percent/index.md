# percent()
Converts a value into a percentage of `maxValue` and parses the result with
the shared numeric parser.

**Examples:**

```ts
percent(25, 200); // 12.5
```

```ts
percent('bad', 100, { fallback: 0 }); // 0
```
