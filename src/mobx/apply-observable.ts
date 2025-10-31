import { makeObservable } from 'mobx';
import type { AnyObject } from 'yummies/types';

export type ObservableAnnotationsArray = [string, any][];

export const applyObservable = (
  context: AnyObject,
  annotationsArray: ObservableAnnotationsArray,
  useDecorators?: boolean,
) => {
  if (useDecorators) {
    annotationsArray.forEach(([field, annotation]) => {
      annotation(context, field);
    });

    makeObservable(context);
  } else {
    makeObservable(context, Object.fromEntries(annotationsArray));
  }
};
