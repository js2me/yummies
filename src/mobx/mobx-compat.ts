import type {
  AnnotationMapEntry,
  IActionFactory,
  computed as MobXComputed,
  observable as MobXObservable,
} from 'mobx';
import * as mobx from 'mobx';

const flatExport = (name: string) => (mobx as any)[name];

const resolveExport = (flatName: string, namespaceName: string, name: string) =>
  (mobx as any)[flatName] ?? (mobx as any)[namespaceName]?.[name];

export type Annotation = Exclude<AnnotationMapEntry, boolean>;
export type ObservableAnnotation = Annotation &
  (typeof MobXObservable extends { ref: infer T } ? T : {});
export type ComputedAnnotation = Annotation &
  (typeof MobXComputed extends { struct: infer T } ? T : {});
export type Variant = 'ref' | 'deep' | 'shallow' | 'struct';

export const supportsLegacyDecorators =
  typeof flatExport('observableRef') !== 'function';

export const comparer = {
  default: resolveExport('compareDefault', 'comparer', 'default'),
  structural: resolveExport('compareStructural', 'comparer', 'structural'),
  shallow: resolveExport('compareShallow', 'comparer', 'shallow'),
};

export const observableRef = resolveExport(
  'observableRef',
  'observable',
  'ref',
) as ObservableAnnotation;
export const observableDeep = resolveExport(
  'observableDeep',
  'observable',
  'deep',
) as ObservableAnnotation;
export const observableShallow = resolveExport(
  'observableShallow',
  'observable',
  'shallow',
) as ObservableAnnotation;
export const observableStruct = resolveExport(
  'observableStruct',
  'observable',
  'struct',
) as ObservableAnnotation;

/** Indexable map for dynamic observable flavour selection (e.g. from config). */
export const observableVariants = {
  ref: observableRef,
  deep: observableDeep,
  shallow: observableShallow,
  struct: observableStruct,
} as Record<Variant, ObservableAnnotation>;

export const computedStruct = resolveExport(
  'computedStruct',
  'computed',
  'struct',
) as ComputedAnnotation;
export const actionBound = resolveExport(
  'actionBound',
  'action',
  'bound',
) as IActionFactory;
