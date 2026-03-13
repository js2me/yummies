# Constants

### NO_VALUE
Placeholder shown when a formatter cannot produce a meaningful value.

**Examples:**

```ts
const fallback = NO_VALUE;
```

```ts
format.number(null, { emptyText: NO_VALUE });
```


### HYPHEN
Plain ASCII hyphen character.

**Examples:**

```ts
const separator = HYPHEN;
```

```ts
`foo${HYPHEN}bar`;
```


### INFINITY
Infinity symbol used by numeric formatters and UI output.

**Examples:**

```ts
const label = INFINITY;
```

```ts
`${INFINITY} items`;
```

