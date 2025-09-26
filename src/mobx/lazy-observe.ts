import { onBecomeObserved, onBecomeUnobserved } from 'mobx';

export const lazyObserve = <TMetaData = void>({
  context,
  property,
  onStart,
  onEnd,
  endDelay = false,
}: {
  context?: any;
  property: any | any[];
  onStart: () => TMetaData;
  onEnd: (metaData: TMetaData, cleanupFn: VoidFunction) => void;
  endDelay?: number | false;
}) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let metaData: TMetaData | undefined;
  const properties = Array.isArray(property) ? property : [property];
  let isObserving = false;

  const start = () => {
    if (isObserving) {
      return;
    }
    isObserving = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    metaData = onStart();
  };

  const cleanup = () => {
    if (!isObserving) {
      return;
    }

    if (endDelay === false) {
      onEnd(metaData!, cleanup);
      metaData = undefined;
      return;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    timeoutId = setTimeout(() => {
      onEnd(metaData!, cleanup);
      timeoutId = undefined;
      metaData = undefined;
    }, endDelay);
  };

  properties.forEach((property) => {
    if (context) {
      onBecomeObserved(context, property, start);
      onBecomeUnobserved(context, property, cleanup);
    } else {
      onBecomeObserved(property, start);
      onBecomeUnobserved(property, cleanup);
    }
  });

  return cleanup;
};
