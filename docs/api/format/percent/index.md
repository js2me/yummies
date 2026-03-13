# Percent

### PercentFormatSettings
_No description._


### percent()
Formats a value as a percent string with configurable decimal precision,
decimal divider and suffix symbol.

**Examples:**

```ts
percent(12.345); // '12.35%'
```

```ts
percent(12.345, { divider: ',', symbol: ' pct' }); // '12,35 pct'
```

