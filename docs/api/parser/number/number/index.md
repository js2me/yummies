# number()
Parses a number from raw input and optionally clamps, rounds or limits
fractional digits.

Strings are normalized by removing spaces and replacing `,` with `.` before
parsing. Invalid inputs return the configured fallback.

**Examples:**

```ts
number('1 234,5'); // 1234.5
```

```ts
number('bad', { fallback: 0 }); // 0
```
