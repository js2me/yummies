import { type AnnotationMapEntry, makeObservable } from 'mobx';
import type { AnyObject } from 'yummies/types';

export type ObservableAnnotationsArray<T extends AnyObject = AnyObject> = [
  AnnotationMapEntry,
  ...(keyof T | (string & {}))[],
][];

export const applyObservable = <T extends AnyObject>(
  context: T,
  annotationsArray: ObservableAnnotationsArray<T>,
  useDecorators?: boolean,
) => {
  if (useDecorators) {
    annotationsArray.forEach(([annotation, ...fields]) => {
      fields.forEach((field) => {
        // @ts-expect-error
        annotation(context, field);
      });
    });

    makeObservable(context);
  } else {
    const annotationsObject: AnyObject = {};

    annotationsArray.forEach(([annotation, ...fields]) => {
      fields.forEach((field) => {
        annotationsObject[field] = annotation;
      });
    });

    makeObservable(context, annotationsObject);
  }
};
