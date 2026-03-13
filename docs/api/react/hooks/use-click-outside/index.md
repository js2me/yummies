# Use Click Outside

### useClickOutside()
Calls a handler when a pointer interaction happens outside the referenced element.

**Examples:**

```ts
useClickOutside({
  contentRef: modalRef,
  onClick: () => closeModal(),
});
```

```ts
useClickOutside({
  contentRef: dropdownRef,
  onClick: hideDropdown,
  options: { capture: true },
});
```

