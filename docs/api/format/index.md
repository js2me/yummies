# format

### format.NO_VALUE
Placeholder shown when a formatter cannot produce a meaningful value.

**Examples:**

```ts
const fallback = NO_VALUE;
```

```ts
format.number(null, { emptyText: NO_VALUE });
```


### format.HYPHEN
Plain ASCII hyphen character.

**Examples:**

```ts
const separator = HYPHEN;
```

```ts
`foo${HYPHEN}bar`;
```


### format.INFINITY
Infinity symbol used by numeric formatters and UI output.

**Examples:**

```ts
const label = INFINITY;
```

```ts
`${INFINITY} items`;
```


### format.NumberFormatSettings
_No description._


### format.number()
Formats a numeric value with thousands separators, fractional digit control
and optional postfix text.

Invalid, empty or unsupported values fall back to `emptyText`.

**Examples:**

```ts
number(12000); // '12 000'
```

```ts
number(12.5, { digits: 1, postfix: '%' }); // '12.5%'
```


### format.PercentFormatSettings
_No description._


### format.percent()
Formats a value as a percent string with configurable decimal precision,
decimal divider and suffix symbol.

**Examples:**

```ts
percent(12.345); // '12.35%'
```

```ts
percent(12.345, { divider: ',', symbol: ' pct' }); // '12,35 pct'
```


### format.skipSpaces()
Removes all whitespace characters from a string.

**Examples:**

```ts
skipSpaces('1 000 000'); // '1000000'
```

```ts
skipSpaces('a\tb\nc'); // 'abc'
```

