import {
  action,
  computed,
  isAction,
  isComputedProp,
  isObservableProp,
  observable,
} from 'mobx';
import { describe, expect, it } from 'vitest';
import { applyObservable } from './apply-observable.js';

describe('applyObservable', () => {
  it('applies annotations using annotation map mode', () => {
    class Store {
      items: string[] = [];
      count = 0;

      constructor() {
        applyObservable(this, [[observable, 'items', 'count']]);
      }
    }

    const store = new Store();
    expect(isObservableProp(store, 'items')).toBe(true);
    expect(isObservableProp(store, 'count')).toBe(true);
    store.items = ['a'];
    store.count = 1;
    expect(store.items).toEqual(['a']);
    expect(store.count).toBe(1);
  });

  it('applies multiple annotation types', () => {
    class Store {
      items: string[] = [];
      count = 0;

      setItems(items: string[]) {
        this.items = items;
      }

      constructor() {
        applyObservable(this, [
          [observable, 'items', 'count'],
          [action, 'setItems'],
        ]);
      }
    }

    const store = new Store();
    expect(isObservableProp(store, 'items')).toBe(true);
    expect(isAction(store.setItems)).toBe(true);
    store.setItems(['a', 'b']);
    expect(store.items).toEqual(['a', 'b']);
  });

  it('applies annotations using decorator mode', () => {
    class Store {
      items: string[] = [];
      count = 0;

      constructor() {
        applyObservable(this, [[observable, 'items', 'count']], true);
      }
    }

    const store = new Store();
    expect(isObservableProp(store, 'items')).toBe(true);
    expect(isObservableProp(store, 'count')).toBe(true);
    store.items = ['x'];
    store.count = 5;
    expect(store.items).toEqual(['x']);
    expect(store.count).toBe(5);
  });

  it('works with computed annotation', () => {
    class Store {
      x = 1;
      y = 2;

      constructor() {
        applyObservable(this, [
          [observable, 'x', 'y'],
          [computed, 'sum'],
        ]);
      }

      get sum() {
        return this.x + this.y;
      }
    }

    const store = new Store();
    expect(isObservableProp(store, 'x')).toBe(true);
    expect(isComputedProp(store, 'sum')).toBe(true);
    expect(store.sum).toBe(3);
  });

  it('works with empty annotations array', () => {
    const obj = { a: 1 };
    expect(() => applyObservable(obj, [])).not.toThrow();
  });

  it('works with annotation that has a single field', () => {
    class Store {
      value = 0;

      constructor() {
        applyObservable(this, [[observable, 'value']]);
      }
    }

    const store = new Store();
    store.value = 42;
    expect(store.value).toBe(42);
  });
});
