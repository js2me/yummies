/**
 * ---header-docs-section---
 * # yummies/mobx
 *
 * ## Description
 *
 * Ready-to-use MobX annotations for `makeObservable` maps and {@link applyObservable} tuples:
 * `observable.*` and `computed` flavours (ref, deep, shallow, struct), `action.bound`, and the
 * MobX comparers. Compatible with both MobX 6 and 7.
 *
 * Import as a namespace so unused annotations are tree-shaken away:
 *
 * ```ts
 * import * as annotation from "yummies/mobx";
 * ```
 *
 * ## Usage
 *
 * ```ts
 * applyObservable(store, [
 *   [annotation.observableRef, 'cache'],
 *   [annotation.computedStruct, 'viewModel'],
 *   [annotation.actionBound, 'refresh'],
 * ]);
 * ```
 */

import {
  type IEqualsComparer,
  computed as mobxComputed,
  observable as mobxObservable,
} from 'mobx';
import {
  type ComputedAnnotation,
  comparer,
  type Variant,
} from './mobx-compat.js';

/**
 * Observable flavour keys: `ref`, `deep`, `shallow`, `struct`, plus `boolean`
 * (`true` → base `observable`, `false` → skip).
 */
export type ObservableTypes = Variant | boolean;

/** Base `observable` (deep by default). */
export const observable = mobxObservable;

/** Base `computed` (reference equality). */
export const computed = mobxComputed;

/** `computed` with shallow equality. */
export const computedShallow = mobxComputed({
  equals: comparer.shallow,
}) as ComputedAnnotation;

/** `computed` with a custom `(a, b) => boolean` comparator. */
export const computedEquals = (equals: IEqualsComparer<any>) =>
  mobxComputed({ equals }) as ComputedAnnotation;
