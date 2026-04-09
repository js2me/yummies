/**
 * ---header-docs-section---
 * # yummies/mobx
 *
 * ## Description
 *
 * **`annotation`** — factories for `makeObservable` maps and {@link applyObservable} tuples:
 * `observable.*` flavours, `computed` with shorthand `equals` (`struct`, `shallow`, reference), custom
 * comparators, and `false` to skip a field.
 *
 * ## Usage
 *
 * ```ts
 * import { annotation } from "yummies/mobx";
 * ```
 */

import {
  comparer,
  computed,
  type IComputedValueOptions,
  type IEqualsComparer,
  observable,
} from 'mobx';
import type { AnyObject } from 'yummies/types';

/**
 * How MobX should compare the previous and next computed value before notifying observers.
 *
 * - `'struct'` — structural comparison (`comparer.structural`).
 * - `'shallow'` — shallow comparison (`comparer.shallow`).
 * - `true` — reference equality (`comparer.default`).
 * - `false` — skip the annotation (handled by the `annotation.computed` / `annotation.observable` helpers).
 * - A custom `(a, b) => boolean` is allowed by the type for parity with `IComputedValueOptions.equals`.
 */
export type ComputedEqualsValue =
  | 'struct'
  | 'shallow'
  | boolean
  | IEqualsComparer<any>;

const computedEqualsResolvers: AnyObject = {
  true: comparer.default,
  shallow: comparer.shallow,
  struct: comparer.structural,
} satisfies Record<
  Exclude<ComputedEqualsValue, Function | boolean> | 'true',
  any
>;

/**
 * Options forwarded to {@link computed}, except `equals` (that argument is passed separately).
 */
export type ComputedOtherOptions = Omit<IComputedValueOptions<any>, 'equals'>;

/**
 * Observable flavour keys returned by {@link annotation.observable}: `ref`, `deep`, `shallow`, `struct`.
 * Also supported: `true` (base `observable`) and `false` (no annotation).
 */
export type ObservableTypes = keyof Pick<
  typeof observable,
  'ref' | 'deep' | 'shallow' | 'struct'
>;

/**
 * MobX annotation factories for `makeObservable` and tuple-style wiring ({@link applyObservable}).
 *
 * - **`annotation.observable(value?)`** — `observable.ref` / `deep` / `shallow` / `struct`; `true` or
 *   omitted → base `observable` (deep by default); `false` → `false` (field omitted from the map).
 * - **`annotation.computed(value?, options?)`** — `computed({ ...options, equals })` with `equals` from
 *   {@link ComputedEqualsValue} or a custom `(a, b) => boolean`. Omitted `value`, unknown literals, and
 *   `true` resolve to `comparer.default`; `value === false` returns `false`.
 *
 * Other `computed` options (except `equals`) go in the second argument; see {@link ComputedOtherOptions}.
 *
 * @example Observable variants
 * ```ts
 * import { makeObservable } from 'mobx';
 * import { annotation } from 'yummies/mobx';
 *
 * class Store {
 *   shallowMap = new Map();
 *   deep = { nested: { count: 0 } };
 *
 *   constructor() {
 *     makeObservable(this, {
 *       shallowMap: annotation.observable('shallow'),
 *       deep: annotation.observable('deep'),
 *     });
 *   }
 * }
 * ```
 *
 * @example Skip a field
 * ```ts
 * makeObservable(this, {
 *   plain: annotation.observable(false), // not decorated
 * });
 * ```
 *
 * @example Computed with structural equality
 * ```ts
 * makeObservable(this, {
 *   fullName: annotation.computed('struct', { name: 'fullName' }),
 * });
 * ```
 *
 * @example Computed with default reference equality
 * ```ts
 * makeObservable(this, {
 *   total: annotation.computed(true),
 * });
 * ```
 *
 * @example Omitted first argument or `true` — reference equality (`comparer.default`)
 * ```ts
 * makeObservable(this, {
 *   n: annotation.computed(undefined, { name: 'n' }),
 *   m: annotation.computed(true, { name: 'm' }), // same `equals` as omitted
 * });
 * ```
 *
 * @example Custom `equals`
 * ```ts
 * makeObservable(this, {
 *   row: annotation.computed((a, b) => a.id === b.id),
 * });
 * ```
 *
 * @example With {@link applyObservable}
 * ```ts
 * applyObservable(store, [
 *   [annotation.observable('shallow'), 'cache', 'index'],
 *   [annotation.computed('struct'), 'viewModel'],
 * ]);
 * ```
 *
 * @example `observable.ref` and skipping `computed`
 * ```ts
 * makeObservable(this, {
 *   handle: annotation.observable('ref'),
 *   skipMe: annotation.computed(false),
 * });
 * ```
 */

type AnnotationObject = {
  computed(value: false): false;
  computed(
    value?: Exclude<ComputedEqualsValue, false>,
    options?: ComputedOtherOptions,
  ): typeof computed.struct;
  observable(value: false): false;
  observable(value?: undefined | true): typeof observable;
  observable<TValue extends ObservableTypes>(
    value: TValue,
  ): (typeof observable)[TValue];
};

export const annotation = {
  computed: (value?: ComputedEqualsValue, options?: ComputedOtherOptions) => {
    if (value === false) return false;

    return computed({
      ...options,
      equals:
        typeof value === 'function'
          ? value
          : (computedEqualsResolvers[
              value as keyof typeof computedEqualsResolvers
            ] ?? comparer.default),
    });
  },
  observable: (value?: ObservableTypes | boolean) => {
    if (value === false) return false;
    if (value === undefined || value === true) return observable;
    return observable[value];
  },
} as AnnotationObject;
