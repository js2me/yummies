# Number

### NumberFormatSettings
_No description._


### number()
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

