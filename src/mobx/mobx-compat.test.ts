import * as mobx from 'mobx';
import { describe, expect, it } from 'vitest';
import {
  actionBound,
  compareDefault,
  compareShallow,
  compareStructural,
  computedStruct,
  observableDeep,
  observableRef,
  observableShallow,
  observableStruct,
  observableVariantMap,
  supportsLegacyDecorators,
} from './mobx-compat.js';

describe('mobx-compat', () => {
  it('resolves comparer equivalents on any MobX major', () => {
    expect(typeof compareDefault).toBe('function');
    expect(typeof compareStructural).toBe('function');
    expect(typeof compareShallow).toBe('function');

    expect(compareDefault(1, 1)).toBe(true);
    expect(compareDefault(1, 2)).toBe(false);
    expect(compareStructural({ a: 1 }, { a: 1 })).toBe(true);
    expect(compareShallow({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('resolves observable variant annotations on any MobX major', () => {
    for (const annotation of [
      observableRef,
      observableDeep,
      observableShallow,
      observableStruct,
    ]) {
      expect(annotation).toBeTruthy();
      expect(typeof (annotation as any).make_).toBe('function');
      expect(typeof (annotation as any).extend_).toBe('function');
    }
  });

  it('resolves computed and action variant annotations on any MobX major', () => {
    expect(typeof (computedStruct as any).make_).toBe('function');
    expect(typeof (actionBound as any).make_).toBe('function');
  });

  it('maps variant keys to resolved annotations', () => {
    expect(observableVariantMap.ref).toBe(observableRef);
    expect(observableVariantMap.deep).toBe(observableDeep);
    expect(observableVariantMap.shallow).toBe(observableShallow);
    expect(observableVariantMap.struct).toBe(observableStruct);
  });

  it('resolves the same annotation instance as the source MobX export', () => {
    // On MobX 7 flat top-level exports are used directly; on MobX 6 namespaced
    // ones. Either way, the resolved annotation must be the runtime's own object.
    const mobxNs = mobx as any;
    if (supportsLegacyDecorators) {
      expect(observableRef).toBe(mobxNs.observable.ref);
      expect(observableStruct).toBe(mobxNs.observable.struct);
      expect(computedStruct).toBe(mobxNs.computed.struct);
    } else {
      expect(observableRef).toBe(mobxNs.observableRef);
      expect(observableStruct).toBe(mobxNs.observableStruct);
      expect(computedStruct).toBe(mobxNs.computedStruct);
    }
  });

  it('detects legacy decorator support consistently with the runtime', () => {
    const hasFlatExports = typeof (mobx as any).observableRef === 'function';
    expect(supportsLegacyDecorators).toBe(!hasFlatExports);
  });
});
