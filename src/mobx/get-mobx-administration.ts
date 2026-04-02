/**
 * ---header-docs-section---
 * # yummies/mobx
 *
 * ## Description
 *
 * Typed access to MobX **internal administration** (`$mobx`) for advanced tooling, migration scripts,
 * or introspection. Prefer public MobX APIs in application code; reach for this when you must align
 * with library internals or patch behavior at the administration layer.
 *
 * ## Usage
 *
 * ```ts
 * import { getMobxAdministration } from "yummies/mobx";
 * ```
 */

import { $mobx, type AnnotationMapEntry } from 'mobx';
import type { AnyObject } from 'yummies/types';

type ObservableObjectAdministration = Parameters<
  Exclude<AnnotationMapEntry, boolean>['make_']
>[0];

/**
 * Returns the internal MobX administration object associated with an observable target.
 *
 * @param context Observable object instance.
 * @returns MobX administration internals stored under `$mobx`.
 *
 * @example
 * ```ts
 * const admin = getMobxAdministration(store);
 * admin.name_;
 * ```
 *
 * @example
 * ```ts
 * const values = getMobxAdministration(formState).values_;
 * ```
 */
export const getMobxAdministration = (
  context: AnyObject,
): ObservableObjectAdministration => context[$mobx];
