# lazyObserve()
When ONE OF the properties is becomes observed then `onStart` function is called.
WHen ALL properties are unobserved then `onEnd` function is called with the `metaData` that was returned by `onStart`.

It uses `onBecomeObserved` and `onBecomeUnobserved` mobx hooks to perform lazy observation.
