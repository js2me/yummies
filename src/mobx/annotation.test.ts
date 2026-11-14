import { makeObservable, observable } from 'mobx';
import { describe, expect, it } from 'vitest';
import { annotation } from './annotation.js';
import { observableMap } from './mobx-compat.js';

describe('annotation.observable', () => {
  it('returns base observable when value is undefined', () => {
    const result = annotation.observable();
    expect(result).toBe(observable);
  });

  it('returns base observable when value is true', () => {
    const result = annotation.observable(true);
    expect(result).toBe(observable);
  });

  it('returns false when value is false', () => {
    const result = annotation.observable(false);
    expect(result).toBe(false);
  });

  it('returns observableRef when value is "ref"', () => {
    const result = annotation.observable('ref');
    expect(result).toBe(observableMap.ref);
  });

  it('returns observableDeep when value is "deep"', () => {
    const result = annotation.observable('deep');
    expect(result).toBe(observableMap.deep);
  });

  it('returns observableShallow when value is "shallow"', () => {
    const result = annotation.observable('shallow');
    expect(result).toBe(observableMap.shallow);
  });

  it('returns observableStruct when value is "struct"', () => {
    const result = annotation.observable('struct');
    expect(result).toBe(observableMap.struct);
  });

  it('works with makeObservable for observable.ref', () => {
    class Store {
      value = null;

      constructor() {
        makeObservable(this, {
          value: annotation.observable('ref'),
        });
      }
    }

    const store = new Store();
    store.value = 'hello';
    expect(store.value).toBe('hello');
  });

  it('works with makeObservable for observable.deep', () => {
    class Store {
      nested = { count: 0 };

      constructor() {
        makeObservable(this, {
          nested: annotation.observable('deep'),
        });
      }
    }

    const store = new Store();
    store.nested.count = 1;
    expect(store.nested.count).toBe(1);
  });

  it('works with makeObservable when value is false (field is skipped)', () => {
    class Store {
      plain = 42;

      constructor() {
        makeObservable(this, {
          plain: annotation.observable(false),
        });
      }
    }

    const store = new Store();
    expect(store.plain).toBe(42);
  });
});

describe('annotation.computed', () => {
  it('returns a computed annotation with comparer.default when value is undefined', () => {
    const result = annotation.computed(undefined, { name: 'test' });
    expect(result).not.toBe(false);
  });

  it('returns a computed annotation with comparer.default when value is true', () => {
    const result = annotation.computed(true);
    expect(result).not.toBe(false);
  });

  it('returns false when value is false', () => {
    const result = annotation.computed(false);
    expect(result).toBe(false);
  });

  it('returns a computed annotation with structural equality when value is "struct"', () => {
    const result = annotation.computed('struct');
    expect(result).not.toBe(false);
  });

  it('returns a computed annotation with shallow equality when value is "shallow"', () => {
    const result = annotation.computed('shallow');
    expect(result).not.toBe(false);
  });

  it('returns a computed annotation with custom equals function', () => {
    const customEquals = (a: any, b: any) => a.id === b.id;
    const result = annotation.computed(customEquals);
    expect(result).not.toBe(false);
  });

  it('works with makeObservable using structural equality', () => {
    class Store {
      x = 1;
      y = 2;

      constructor() {
        makeObservable(this, {
          x: observable,
          y: observable,
          sum: annotation.computed('struct'),
        });
      }

      get sum() {
        return { total: this.x + this.y };
      }
    }

    const store = new Store();
    expect(store.sum.total).toBe(3);
  });

  it('works with makeObservable using default equality', () => {
    class Store {
      x = 1;

      constructor() {
        makeObservable(this, {
          x: observable,
          double: annotation.computed(true),
        });
      }

      get double() {
        return this.x * 2;
      }
    }

    const store = new Store();
    expect(store.double).toBe(2);
  });

  it('passes options to computed', () => {
    const result = annotation.computed(undefined, { name: 'myComputed' });
    expect(result).not.toBe(false);
  });

  it('resolves unknown value to comparer.default', () => {
    // Unknown string values should fall back to comparer.default
    const result = annotation.computed('unknown' as any);
    expect(result).not.toBe(false);
  });
});
