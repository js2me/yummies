import { onBecomeObserved, onBecomeUnobserved } from 'mobx';

/**
 * When ONE OF the properties is becomes observed then `onStart` function is called.
 * WHen ALL properties are unobserved then `onEnd` function is called with the `metaData` that was returned by `onStart`.
 *
 * It uses `onBecomeObserved` and `onBecomeUnobserved` mobx hooks to perform lazy observation.
 */
export const lazyObserve = <TMetaData = void>({
  context,
  property,
  onStart,
  onEnd,
  endDelay = false,
}: {
  context?: any;
  property: any | any[];
  onStart?: () => TMetaData;
  onEnd?: (metaData: TMetaData, cleanupFn: VoidFunction) => void;
  endDelay?: number | false;
}) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let metaData: TMetaData | undefined;
  const observingProps = new Set<string>();
  const properties = Array.isArray(property) ? property : [property];

  const cleanup = () => {
    observingProps.clear();

    if (endDelay === false) {
      onEnd?.(metaData!, cleanup);
      metaData = undefined;
      return;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }

    timeoutId = setTimeout(() => {
      onEnd?.(metaData!, cleanup);
      timeoutId = undefined;
      metaData = undefined;
    }, endDelay);
  };

  const start = (property: string) => {
    const isAlreadyObserving = observingProps.size > 0;
    observingProps.add(property);

    if (isAlreadyObserving) {
      return;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }

    metaData = onStart?.();
  };

  const stop = (property: string) => {
    const isAlreadyNotObserving = !observingProps.size;

    observingProps.delete(property);

    const isObserving = observingProps.size > 0;

    if (isAlreadyNotObserving || isObserving) {
      return;
    }

    cleanup();
  };

  properties.forEach((property) => {
    if (context) {
      onBecomeObserved(context, property, () => start(property));
      onBecomeUnobserved(context, property, () => stop(property));
    } else {
      onBecomeObserved(property, () => start(property));
      onBecomeUnobserved(property, () => stop(property));
    }
  });

  return cleanup;
};
