/**
 * ---header-docs-section---
 * # yummies/mobx
 *
 * ## Description
 *
 * Compact **MobX `makeObservable`** wiring from tuple lists of annotations and keys. Reduces boilerplate
 * when many fields share `observable`, `action`, or `computed` decorators and you want one call site
 * instead of sprawling annotation maps across large stores.
 *
 * ## Usage
 *
 * ```ts
 * import { applyObservable } from "yummies/mobx";
 * ```
 */

import { type AnnotationMapEntry, makeObservable } from 'mobx';
import type { AnyObject } from 'yummies/types';
import { supportsLegacyDecorators } from './mobx-compat.js';

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
 *   Note: In MobX 7, legacy decorators are removed, so this flag falls back to the
 *   annotation map form automatically.
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
  const annotationsObject: AnyObject = {};

  annotationsArray.forEach(([annotation, ...fields]) => {
    fields.forEach((field) => {
      annotationsObject[field] = annotation;
    });
  });

  if (useDecorators && supportsLegacyDecorators) {
    // MobX 6 path: apply annotations eagerly (legacy decorator invocation),
    // then let makeObservable pick up the recorded annotations.
    annotationsArray.forEach(([annotation, ...fields]) => {
      fields.forEach((field) => {
        // @ts-expect-error — annotation invocation, not a decorator literal
        annotation(context, field);
      });
    });

    // MobX 6 accepts `makeObservable(target)` without annotations after
    // eager application; MobX typings require the second argument, hence the cast.
    (makeObservable as any)(context);
    return;
  }

  // Annotation map form — works on both MobX 6 and 7+.
  // On MobX 7+ legacy decorators are removed, so `useDecorators` has no effect
  // and the map form is used instead.
  makeObservable(context, annotationsObject);
};
