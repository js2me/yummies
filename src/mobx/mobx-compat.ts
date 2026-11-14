import type {
  AnnotationMapEntry,
  computed as MobXComputed,
  observable as MobXObservable,
} from 'mobx';
import * as mobx from 'mobx';

export type Annotation = Exclude<AnnotationMapEntry, boolean>;
export type ObservableAnnotation = Annotation &
  (typeof MobXObservable extends { ref: infer T } ? T : {});
export type ComputedAnnotation = Annotation &
  (typeof MobXComputed extends { struct: infer T } ? T : {});
export type Variant = 'ref' | 'deep' | 'shallow' | 'struct';

export const supportsLegacyDecorators =
  typeof (mobx as any).observableRef !== 'function';

export const comparer = {
  default: (mobx as any).compareDefault ?? (mobx as any).comparer?.default,
  structural:
    (mobx as any).compareStructural ?? (mobx as any).comparer?.structural,
  shallow: (mobx as any).compareShallow ?? (mobx as any).comparer?.shallow,
};

export const observableRef =
  (mobx as any).observableRef ?? (mobx as any).observable?.ref;
export const observableDeep =
  (mobx as any).observableDeep ?? (mobx as any).observable?.deep;
export const observableShallow =
  (mobx as any).observableShallow ?? (mobx as any).observable?.shallow;
export const observableStruct =
  (mobx as any).observableStruct ?? (mobx as any).observable?.struct;

/** Indexable map for dynamic observable flavour selection (e.g. from config). */
export const observableVariants = {
  ref: observableRef,
  deep: observableDeep,
  shallow: observableShallow,
  struct: observableStruct,
} as Record<Variant, ObservableAnnotation>;

export const computedStruct =
  (mobx as any).computedStruct ?? (mobx as any).computed?.struct;
export const actionBound =
  (mobx as any).actionBound ?? (mobx as any).action?.bound;
