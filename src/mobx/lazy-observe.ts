import { onBecomeObserved, onBecomeUnobserved } from 'mobx';

/**
 * Starts side effects only while one or more MobX observables are being observed.
 *
 * When the first property becomes observed, `onStart` is called. When all tracked
 * properties become unobserved, `onEnd` is called with the value returned by
 * `onStart`. Cleanup can be delayed via `endDelay`.
 *
 * It uses MobX `onBecomeObserved` and `onBecomeUnobserved` hooks to perform
 * lazy subscription management.
 *
 * @template TMetaData Data returned from `onStart` and forwarded to `onEnd`.
 * @param config Configuration for tracked properties and lifecycle callbacks.
 * @returns Cleanup function that clears the tracked state and runs `onEnd`.
 *
 * @example
 * ```ts
 * const stop = lazyObserve({
 *   context: store,
 *   property: 'items',
 *   onStart: () => api.subscribe(),
 *   onEnd: (subscription) => subscription.unsubscribe(),
 * });
 * ```
 *
 * @example
 * ```ts
 * lazyObserve({
 *   property: [boxA, boxB],
 *   onStart: () => console.log('observed'),
 *   endDelay: 300,
 * });
 * ```
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
