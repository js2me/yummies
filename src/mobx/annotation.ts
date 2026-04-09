import {
  comparer,
  computed,
  type IComputedValueOptions,
  observable,
} from 'mobx';
import type { AnyObject } from 'yummies/types';

/**
 * How MobX should compare the previous and next computed value before notifying observers.
 *
 * - `'struct'` — structural comparison (`comparer.structural`).
 * - `'shallow'` — shallow comparison (`comparer.shallow`).
 * - `true` — reference equality (`comparer.default`).
 * - `false` — disable the annotation (see {@link annotation}).
 * - A custom `(a, b) => boolean` is allowed by the type for parity with `IComputedValueOptions.equals`.
 */
export type ComputedEqualsValue =
  | 'struct'
  | 'shallow'
  | boolean
  | ((a: any, b: any) => boolean);

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
 * Observable “flavour” keys supported by {@link observable}: `ref`, `deep`, `shallow`, `struct`.
 */
export type ObservableTypes = keyof Pick<
  typeof observable,
  'ref' | 'deep' | 'shallow' | 'struct'
>;

/**
 * Returns a MobX annotation factory for `makeObservable` / tuple-style wiring: either an
 * `observable.*` variant or a preconfigured `computed({ ... })` decorator.
 *
 * Pass `false` as the second argument to skip annotating that field (returns `false`).
 *
 * @param kind - `'observable'` or `'computed'`.
 * @param value - For `observable`, one of {@link ObservableTypes} or `false`. For `computed`,
 *   a {@link ComputedEqualsValue} (or `false`).
 * @param options - Only for `computed`: extra options merged into `computed({ ... })`.
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
 *       shallowMap: annotation('observable', 'shallow'),
 *       deep: annotation('observable', 'deep'),
 *     });
 *   }
 * }
 * ```
 *
 * @example Skip a field
 * ```ts
 * makeObservable(this, {
 *   plain: annotation('observable', false), // not decorated
 * });
 * ```
 *
 * @example Computed with structural equality
 * ```ts
 * makeObservable(this, {
 *   fullName: annotation('computed', 'struct', { name: 'fullName' }),
 * });
 * ```
 *
 * @example Computed with default reference equality
 * ```ts
 * makeObservable(this, {
 *   total: annotation('computed', true),
 * });
 * ```
 */
export function annotation(
  kind: 'observable',
  type: ObservableTypes | false,
):
  | typeof observable
  | typeof observable.struct
  | typeof observable.ref
  | typeof observable.deep
  | typeof observable.shallow
  | false;
export function annotation(
  kind: 'computed',
  equals: ComputedEqualsValue,
  options?: ComputedOtherOptions,
): ReturnType<typeof computed> | false;

export function annotation(kind: any, value: any, options?: any): any {
  if (value === false) {
    return false;
  }

  if (kind === 'computed') {
    const equalsFn = computedEqualsResolvers[value] ?? comparer.default;

    return computed({
      ...options,
      equals: equalsFn,
    });
  } else {
    return observable[value as ObservableTypes];
  }
}
