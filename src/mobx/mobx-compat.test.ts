import * as mobx from 'mobx';
import { describe, expect, it } from 'vitest';
import {
  actionBound,
  comparer,
  computedStruct,
  observableDeep,
  observableRef,
  observableShallow,
  observableStruct,
  supportsLegacyDecorators,
} from './index.js';

describe('mobx compat', () => {
  it('resolves comparer equivalents on any MobX major', () => {
    expect(comparer.default(1, 1)).toBe(true);
    expect(comparer.default(1, 2)).toBe(false);
    expect(comparer.structural({ a: 1 }, { a: 1 })).toBe(true);
    expect(comparer.shallow({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('resolves observable annotations', () => {
    for (const annotation of [
      observableRef,
      observableDeep,
      observableShallow,
      observableStruct,
    ]) {
      expect(typeof annotation.make_).toBe('function');
      expect(typeof annotation.extend_).toBe('function');
    }
  });

  it('resolves computed and action annotations', () => {
    expect(typeof computedStruct.make_).toBe('function');
    expect(typeof actionBound.make_).toBe('function');
  });

  it('resolves annotation instances from the installed MobX version', () => {
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

  it('detects legacy decorator support from the installed API', () => {
    const hasFlatExports = typeof (mobx as any).observableRef === 'function';
    expect(supportsLegacyDecorators).toBe(!hasFlatExports);
  });
});
