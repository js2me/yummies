# OverrideKey
Replace value in object by key

**Example:**

```ts
```ts
type Test = ` foo: string; bar?: number `;
type FixedTest = OverrideKey<Test, 'bar', string>
// ` foo: string; bar?: string `
```
```
