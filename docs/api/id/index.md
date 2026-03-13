# Id

### generateId
Использует алфавит abcdefghijklmnopqrstuvwxyz0123456789
Размер 6


### generateShortId
Использует алфавит abcdefghijklmnopqrstuvwxyz0123456789
Размер 4


### generateNumericId
Использует алфавит 0123456789
Размер 6


### generateNumericShortId
Использует алфавит 0123456789
Размер 4


### createLinearNumericIdGenerator()
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


### generateLinearNumericId
_No description._

**Example:**

```ts
generateLinearNumericId() // '000000000'
generateLinearNumericId() // '000000001'
...
generateLinearNumericId() // '999999999'
generateLinearNumericId() // '1000000000'
...
generateLinearNumericId() // '9999999999'
generateLinearNumericId() // '10000000000'
```


### generateStackBasedId()
Is not recommended to use.

Generates execution stack based pseudo-id (just sliced string from error stack)

