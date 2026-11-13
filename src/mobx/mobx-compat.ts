/**
 * Compatibility layer for MobX 6 and MobX 7.
 *
 * MobX 7 removed namespaced APIs (`comparer.default`, `observable.ref`, etc.)
 * and replaced them with named exports (`compareDefault`, `observableRef`, etc.).
 * This module provides a unified API that works with both versions.
 *
 * @internal
 */

import type { AnnotationMapEntry } from 'mobx';
import * as mobx from 'mobx';

/**
 * MobX Annotation type — works across both MobX 6 and 7.
 * In MobX 6 this is `mobx.Annotation`, in MobX 7 it's only in `mobx/dist/internal`.
 * We derive it from `AnnotationMapEntry` which is public in both versions.
 */
export type MobXAnnotation = Exclude<AnnotationMapEntry, boolean>;

// --- Version capability detection ---

/**
 * Whether the runtime MobX still supports legacy decorator application —
 * calling an annotation directly as `annotation(target, key)`.
 * MobX 6 supports it; MobX 7 removed legacy decorators entirely
 * (annotations are only callable as TC39 decorators there), so a call in that
 * form dies or no-ops depending on the build.
 *
 * Detected via the MobX 7-only flat annotation exports: `observableRef` does
 * not exist in MobX 6, where the equivalent lives at `observable.ref`.
 */
export const supportsLegacyDecorators =
  typeof (mobx as any).observableRef !== 'function';

// --- Comparer compat ---

/** `compareDefault` (MobX 7) / `comparer.default` (MobX 6) */
export const compareDefault: (a: any, b: any) => boolean =
  (mobx as any).compareDefault ?? (mobx as any).comparer?.default;

/** `compareStructural` (MobX 7) / `comparer.structural` (MobX 6) */
export const compareStructural: (a: any, b: any) => boolean =
  (mobx as any).compareStructural ?? (mobx as any).comparer?.structural;

/** `compareShallow` (MobX 7) / `comparer.shallow` (MobX 6) */
export const compareShallow: (a: any, b: any) => boolean =
  (mobx as any).compareShallow ?? (mobx as any).comparer?.shallow;

// --- Observable variant compat ---

/** `observableRef` (MobX 7) / `observable.ref` (MobX 6) */
export const observableRef: MobXAnnotation =
  (mobx as any).observableRef ?? (mobx as any).observable?.ref;

/** `observableDeep` (MobX 7) / `observable.deep` (MobX 6) */
export const observableDeep: MobXAnnotation =
  (mobx as any).observableDeep ?? (mobx as any).observable?.deep;

/** `observableShallow` (MobX 7) / `observable.shallow` (MobX 6) */
export const observableShallow: MobXAnnotation =
  (mobx as any).observableShallow ?? (mobx as any).observable?.shallow;

/** `observableStruct` (MobX 7) / `observable.struct` (MobX 6) */
export const observableStruct: MobXAnnotation =
  (mobx as any).observableStruct ?? (mobx as any).observable?.struct;

// --- Computed variant compat ---

/** `computedStruct` (MobX 7) / `computed.struct` (MobX 6) */
export const computedStruct: MobXAnnotation =
  (mobx as any).computedStruct ?? (mobx as any).computed?.struct;

// --- Action variant compat ---

/** `actionBound` (MobX 7) / `action.bound` (MobX 6) */
export const actionBound: MobXAnnotation =
  (mobx as any).actionBound ?? (mobx as any).action?.bound;

// --- Observable variant map for annotation.observable() ---

/** Map of observable variant keys to their annotation values, compatible with both MobX 6 and 7 */
export const observableVariantMap: Record<string, MobXAnnotation> = {
  ref: observableRef,
  deep: observableDeep,
  shallow: observableShallow,
  struct: observableStruct,
};
