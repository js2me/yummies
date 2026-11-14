import { makeObservable, observable } from 'mobx';
import { describe, expect, it } from 'vitest';
import * as annotation from './index.js';

describe('annotation', () => {
  it('exposes direct observable annotations', () => {
    expect(annotation.observable).toBe(observable);
    expect(typeof annotation.observableRef.make_).toBe('function');
    expect(typeof annotation.observableDeep.make_).toBe('function');
    expect(typeof annotation.observableShallow.make_).toBe('function');
    expect(typeof annotation.observableStruct.make_).toBe('function');
  });

  it('exposes direct computed annotations', () => {
    expect(typeof annotation.computed.make_).toBe('function');
    expect(typeof annotation.computedStruct.make_).toBe('function');
    expect(typeof annotation.computedShallow.make_).toBe('function');
    expect(typeof annotation.computedEquals(() => true).make_).toBe('function');
  });

  it('exposes action and comparer', () => {
    expect(typeof annotation.actionBound.make_).toBe('function');
    expect(typeof annotation.comparer.structural).toBe('function');
  });

  it('works with makeObservable for observableRef', () => {
    class Store {
      value = null;

      constructor() {
        makeObservable(this, {
          value: annotation.observableRef,
        });
      }
    }

    const store = new Store();
    store.value = 'hello';
    expect(store.value).toBe('hello');
  });

  it('works with makeObservable for observableDeep', () => {
    class Store {
      nested = { count: 0 };

      constructor() {
        makeObservable(this, {
          nested: annotation.observableDeep,
        });
      }
    }

    const store = new Store();
    store.nested.count = 1;
    expect(store.nested.count).toBe(1);
  });

  it('works with makeObservable for computedStruct', () => {
    class Store {
      x = 1;
      y = 2;

      constructor() {
        makeObservable(this, {
          x: observable,
          y: observable,
          sum: annotation.computedStruct,
        });
      }

      get sum() {
        return { total: this.x + this.y };
      }
    }

    const store = new Store();
    expect(store.sum.total).toBe(3);
  });

  it('works with makeObservable for computed', () => {
    class Store {
      x = 1;

      constructor() {
        makeObservable(this, {
          x: observable,
          double: annotation.computed,
        });
      }

      get double() {
        return this.x * 2;
      }
    }

    const store = new Store();
    expect(store.double).toBe(2);
  });
});
