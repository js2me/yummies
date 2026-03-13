# Use Intersection Observer

### useIntersectionObserver()
Creates a single `IntersectionObserver` instance and disposes it on unmount.

**Examples:**

```ts
const observer = useIntersectionObserver((entries) => {
  console.log(entries[0]?.isIntersecting);
});
```

```ts
const observer = useIntersectionObserver(handleIntersect, { threshold: 0.5 });
observer.observe(element);
```

