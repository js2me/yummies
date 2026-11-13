import * as mobx from 'mobx';
import { describe, expect, it } from 'vitest';
import { observableMap } from './mobx-compat.js';

describe('observableMap', () => {
  it('resolves comparer equivalents on any MobX major', () => {
    expect(observableMap.comparer.default(1, 1)).toBe(true);
    expect(observableMap.comparer.default(1, 2)).toBe(false);
    expect(observableMap.comparer.structural({ a: 1 }, { a: 1 })).toBe(true);
    expect(observableMap.comparer.shallow({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('resolves observable annotations', () => {
    for (const annotation of [
      observableMap.ref,
      observableMap.deep,
      observableMap.shallow,
      observableMap.struct,
    ]) {
      expect(typeof annotation.make_).toBe('function');
      expect(typeof annotation.extend_).toBe('function');
    }
  });

  it('resolves computed and action annotations', () => {
    expect(typeof observableMap.computed.struct.make_).toBe('function');
    expect(typeof observableMap.action.bound.make_).toBe('function');
  });

  it('resolves annotation instances from the installed MobX version', () => {
    const mobxNs = mobx as any;
    if (observableMap.supportsLegacyDecorators) {
      expect(observableMap.ref).toBe(mobxNs.observable.ref);
      expect(observableMap.struct).toBe(mobxNs.observable.struct);
      expect(observableMap.computed.struct).toBe(mobxNs.computed.struct);
    } else {
      expect(observableMap.ref).toBe(mobxNs.observableRef);
      expect(observableMap.struct).toBe(mobxNs.observableStruct);
      expect(observableMap.computed.struct).toBe(mobxNs.computedStruct);
    }
  });

  it('detects legacy decorator support from the installed API', () => {
    const hasFlatExports = typeof (mobx as any).observableRef === 'function';
    expect(observableMap.supportsLegacyDecorators).toBe(!hasFlatExports);
  });
});
