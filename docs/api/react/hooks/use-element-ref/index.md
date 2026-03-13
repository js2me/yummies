# Use Element Ref

### useElementRef()
Resolves an element once after mount and stores it in a ref.

**Examples:**

```ts
const buttonRef = useElementRef(() => document.getElementById('save') as HTMLButtonElement);
```

```ts
const modalRef = useElementRef(() => document.querySelector('.modal') as HTMLDivElement);
```

