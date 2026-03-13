# createLinearNumericIdGenerator()
Создает функцию, которая будет создавать уникальную строку, уникальность которой основана на порядке вызова этой функции

**Example:**

```ts
generateLinearNumericId = createLinearNumericIdGenerator(6);
generateLinearNumericId() // '000000'
generateLinearNumericId() // '000001'
...
generateLinearNumericId() // '999999'
generateLinearNumericId() // '1000000'
...
generateLinearNumericId() // '9999999'
generateLinearNumericId() // '10000000'
```
