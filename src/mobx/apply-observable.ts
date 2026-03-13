import { type AnnotationMapEntry, makeObservable } from 'mobx';
import type { AnyObject } from 'yummies/types';

export type ObservableAnnotationsArray<T extends AnyObject = AnyObject> = [
  AnnotationMapEntry,
  ...(keyof T | (string & {}))[],
][];

/**
 * Applies a compact list of MobX annotations to an object using either
 * decorator-style invocation or the annotation map form accepted by `makeObservable`.
 *
 * @template T Target object type.
 * @param context Object that should become observable.
 * @param annotationsArray Tuples of annotation followed by annotated field names.
 * @param useDecorators Enables decorator-style application before calling `makeObservable`.
 *
 * @example
 * ```ts
 * applyObservable(store, [[observable, 'items'], [action, 'setItems']]);
 * ```
 *
 * @example
 * ```ts
 * applyObservable(viewModel, [[computed, 'fullName']], true);
 * ```
 */
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
