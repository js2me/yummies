import type {
  AnnotationMapEntry,
  computed as MobXComputed,
  observable as MobXObservable,
} from 'mobx';
import * as mobx from 'mobx';

const mobxApi = mobx as any;

const resolveExport = (flatName: string, namespaceName: string, name: string) =>
  mobxApi[flatName] ?? mobxApi[namespaceName]?.[name];

export namespace observableMap {
  export type Annotation = Exclude<AnnotationMapEntry, boolean>;
  export type ObservableAnnotation = Annotation &
    (typeof MobXObservable extends { ref: infer T } ? T : {});
  export type ComputedAnnotation = Annotation &
    (typeof MobXComputed extends { struct: infer T } ? T : {});
  export type Variant = {
    [Key in keyof typeof observableMap]: (typeof observableMap)[Key] extends Annotation
      ? Key
      : never;
  }[keyof typeof observableMap];

  export const supportsLegacyDecorators =
    typeof mobxApi.observableRef !== 'function';

  export const comparer = {
    default: resolveExport('compareDefault', 'comparer', 'default') as (
      a: any,
      b: any,
    ) => boolean,
    structural: resolveExport(
      'compareStructural',
      'comparer',
      'structural',
    ) as (a: any, b: any) => boolean,
    shallow: resolveExport('compareShallow', 'comparer', 'shallow') as (
      a: any,
      b: any,
    ) => boolean,
  };

  export const ref = resolveExport(
    'observableRef',
    'observable',
    'ref',
  ) as ObservableAnnotation;
  export const deep = resolveExport(
    'observableDeep',
    'observable',
    'deep',
  ) as ObservableAnnotation;
  export const shallow = resolveExport(
    'observableShallow',
    'observable',
    'shallow',
  ) as ObservableAnnotation;
  export const struct = resolveExport(
    'observableStruct',
    'observable',
    'struct',
  ) as ObservableAnnotation;

  export const computed = {
    struct: resolveExport(
      'computedStruct',
      'computed',
      'struct',
    ) as ComputedAnnotation,
  };
  export const action = {
    bound: resolveExport('actionBound', 'action', 'bound') as Annotation,
  };
}
