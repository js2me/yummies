# Use Instance

### InstanceCreateConfig
_No description._


### createUseInstanceHook()
Builds a custom hook that creates an instance once and wires lifecycle helpers
such as an `AbortSignal` and optional extension data into the factory.


### useInstance
The `useInstance` hook is used to create and manage an instance of an object
that requires access to the root store and an abort signal.

You can create YOUR OWN CUSTOM `useInstance` hook using `createUseInstanceHook` if you need
to provide some specific data

