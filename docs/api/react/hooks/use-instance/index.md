# Use Instance

### InstanceCreateConfig
_No description._


### createUseInstanceHook()
Builds a custom hook that creates an instance once and wires lifecycle helpers
such as an `AbortSignal` and optional extension data into the factory.

**Examples:**

```ts
const useStoreInstance = createUseInstanceHook({ api });
```

```ts
const useService = createUseInstanceHook({ logger });
const service = useService(({ logger, payload }) => new Service(logger, payload));
```


### useInstance
The `useInstance` hook is used to create and manage an instance of an object
that requires access to the root store and an abort signal.

You can create YOUR OWN CUSTOM `useInstance` hook using `createUseInstanceHook` if you need
to provide some specific data

**Examples:**

```ts
const service = useInstance(({ abortSignal }) => new UsersService({ abortSignal }));
```

```ts
const store = useInstance(
  ({ payload }) => new UserStore(payload),
  { payload: userId, onUpdate: (nextId) => console.log(nextId) },
);
```

