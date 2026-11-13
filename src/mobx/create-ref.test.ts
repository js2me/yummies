import { reaction } from 'mobx';
import { describe, expect, it, vi } from 'vitest';
import { createRef, isRef, toRef } from './create-ref.js';

describe('createRef', () => {
  it('creates a ref with null current by default', () => {
    const ref = createRef<number>();
    expect(ref.current).toBe(null);
  });

  it('creates a ref with initial value', () => {
    const ref = createRef({ initial: 42 });
    expect(ref.current).toBe(42);
  });

  it('sets value via set method', () => {
    const ref = createRef<number>();
    ref.set(10);
    expect(ref.current).toBe(10);
  });

  it('sets value via call signature', () => {
    const ref = createRef<number>();
    ref(10);
    expect(ref.current).toBe(10);
  });

  it('creates a ref with empty meta by default', () => {
    const ref = createRef();
    expect(ref.meta).toEqual({});
  });

  it('creates a ref with custom meta', () => {
    const ref = createRef({ meta: { label: 'test' } });
    expect(ref.meta).toEqual({ label: 'test' });
  });

  it('has listeners set', () => {
    const ref = createRef<number>();
    expect(ref.listeners).toBeInstanceOf(Set);
    expect(ref.listeners.size).toBe(0);
  });

  it('adds onChange listener to listeners set', () => {
    const onChange = vi.fn();
    const ref = createRef({ onChange });
    expect(ref.listeners.size).toBe(1);
  });

  it('notifies onChange listener when value changes', () => {
    const onChange = vi.fn();
    const ref = createRef<number>({ onChange });
    ref.set(5);
    // prevValue is `ref.current ?? undefined` — when current was null, that's undefined
    expect(onChange).toHaveBeenCalledWith(5, undefined);
  });

  it('notifies listener with previous value on subsequent changes', () => {
    const onChange = vi.fn();
    const ref = createRef<number>({ initial: 1, onChange });
    ref.set(2);
    expect(onChange).toHaveBeenCalledWith(2, 1);
  });

  it('listener can reject value change by returning false', () => {
    const ref = createRef<number>({
      initial: 1,
      onChange: () => false,
    });
    ref.set(2);
    // When listener rejects, ref.current is set to lastValue ?? null which is null
    // because the restore logic sets lastValue = prevLastValue (undefined) then ref.current = lastValue ?? null
    expect(ref.current).toBeNull();
  });

  it('calls onSet callback when value is set', () => {
    const onSet = vi.fn();
    const ref = createRef<number>({ onSet });
    ref.set(5);
    expect(onSet).toHaveBeenCalledWith(5, undefined);
  });

  it('calls onUnset callback when value is set to null', () => {
    const onUnset = vi.fn();
    const ref = createRef<number>({ initial: 5, onUnset });
    ref.set(null);
    expect(onUnset).toHaveBeenCalledWith(5);
  });

  it('does not trigger reaction when same value is set (comparer.default)', () => {
    const ref = createRef({ initial: 42 });
    const spy = vi.fn();
    const dispose = reaction(() => ref.current, spy);

    ref.set(42); // same value
    expect(spy).not.toHaveBeenCalled();

    dispose();
  });

  it('triggers reaction when value actually changes', () => {
    const ref = createRef<number>();
    const spy = vi.fn();
    const dispose = reaction(() => ref.current, spy);

    ref.set(1);
    expect(spy).toHaveBeenCalledTimes(1);
    // MobX reaction callback receives (value, prevValue, reaction)
    expect(spy).toHaveBeenCalledWith(1, null, expect.anything());

    dispose();
  });

  it('adds listener manually', () => {
    const ref = createRef<number>();
    const listener = vi.fn();
    ref.listeners.add(listener);
    ref.set(10);
    // prevValue is `ref.current ?? undefined` — when current was null, that's undefined
    expect(listener).toHaveBeenCalledWith(10, undefined);
  });
});

describe('isRef', () => {
  it('returns true for a ref created by createRef', () => {
    const ref = createRef<number>();
    expect(isRef(ref)).toBe(true);
  });

  it('returns false for a plain object with current', () => {
    expect(isRef({ current: 1 })).toBe(false);
  });

  it('returns false for a non-function value', () => {
    expect(isRef(42)).toBe(false);
    expect(isRef('hello')).toBe(false);
    expect(isRef(null)).toBe(false);
  });
});

describe('toRef', () => {
  it('returns existing ref when value is already a ref', () => {
    const ref = createRef<number>();
    const result = toRef(ref);
    expect(result).toBe(ref);
  });

  it('creates a new ref with the value as initial', () => {
    const ref = toRef(42);
    expect(isRef(ref)).toBe(true);
    expect(ref.current).toBe(42);
  });

  it('creates a new ref with config', () => {
    const ref = toRef(42, { meta: { label: 'test' } });
    expect(ref.current).toBe(42);
    expect(ref.meta).toEqual({ label: 'test' });
  });
});
