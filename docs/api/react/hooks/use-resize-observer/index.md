# Use Resize Observer

### useResizeObserver()
Creates a stable `ResizeObserver` instance and disconnects it on unmount.

**Examples:**

```ts
const observerRef = useResizeObserver((entries) => {
  console.log(entries[0]?.contentRect.width);
});
```

```ts
const resizeObserver = useResizeObserver(handleResize);
resizeObserver.current.observe(element);
```

