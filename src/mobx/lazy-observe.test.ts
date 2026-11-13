import { observable } from 'mobx';
import { describe, expect, it, vi } from 'vitest';
import { lazyObserve } from './lazy-observe.js';

describe('lazyObserve', () => {
  it('calls onStart when a property becomes observed', () => {
    const onStart = vi.fn();
    const store = observable({ items: [] });

    const cleanup = lazyObserve({
      context: store,
      property: 'items',
      onStart,
    });

    // Simulate observation by reading the property in an autorun
    const { autorun } = require('mobx');
    const dispose = autorun(() => store.items);

    expect(onStart).toHaveBeenCalledTimes(1);

    dispose();
    cleanup();
  });

  it('calls onEnd when a property is no longer observed', () => {
    const onEnd = vi.fn();
    const store = observable({ items: [] });

    const cleanup = lazyObserve({
      context: store,
      property: 'items',
      onStart: () => 'subscription',
      onEnd,
    });

    const { autorun } = require('mobx');
    const dispose = autorun(() => store.items);

    dispose();

    expect(onEnd).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('passes onStart return value to onEnd', () => {
    const metaData = { type: 'subscription' };
    const onEnd = vi.fn();
    const store = observable({ items: [] });

    const cleanup = lazyObserve({
      context: store,
      property: 'items',
      onStart: () => metaData,
      onEnd,
    });

    const { autorun } = require('mobx');
    const dispose = autorun(() => store.items);

    dispose();

    expect(onEnd).toHaveBeenCalledWith(metaData, expect.any(Function));
    cleanup();
  });

  it('does not call onStart again if already observing another property', () => {
    const onStart = vi.fn();
    const store = observable({ items: [], count: 0 });

    const cleanup = lazyObserve({
      context: store,
      property: ['items', 'count'],
      onStart,
    });

    const { autorun } = require('mobx');
    const dispose1 = autorun(() => store.items);

    expect(onStart).toHaveBeenCalledTimes(1);

    const dispose2 = autorun(() => store.count);

    // Should not call onStart again since we're already observing
    expect(onStart).toHaveBeenCalledTimes(1);

    dispose1();
    dispose2();
    cleanup();
  });

  it('does not call onEnd until all properties are unobserved', () => {
    const onEnd = vi.fn();
    const store = observable({ items: [], count: 0 });

    const cleanup = lazyObserve({
      context: store,
      property: ['items', 'count'],
      onStart: () => 'data',
      onEnd,
    });

    const { autorun } = require('mobx');
    const dispose1 = autorun(() => store.items);
    const dispose2 = autorun(() => store.count);

    dispose1();

    // Still observing count, so onEnd should not be called
    expect(onEnd).not.toHaveBeenCalled();

    dispose2();

    // Now all properties are unobserved
    expect(onEnd).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('supports observable box without context', () => {
    const onStart = vi.fn();
    const onEnd = vi.fn();
    const box = observable.box(0);

    const cleanup = lazyObserve({
      property: box,
      onStart,
      onEnd,
    });

    const { autorun } = require('mobx');
    const dispose = autorun(() => box.get());

    expect(onStart).toHaveBeenCalledTimes(1);

    dispose();

    expect(onEnd).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('returns a cleanup function', () => {
    const onStart = vi.fn();
    const store = observable({ items: [] });

    const cleanup = lazyObserve({
      context: store,
      property: 'items',
      onStart,
    });

    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('delays onEnd when endDelay is set', () => {
    vi.useFakeTimers();
    const onEnd = vi.fn();
    const store = observable({ items: [] });

    const cleanup = lazyObserve({
      context: store,
      property: 'items',
      onStart: () => 'data',
      onEnd,
      endDelay: 300,
    });

    const { autorun } = require('mobx');
    const dispose = autorun(() => store.items);

    dispose();

    expect(onEnd).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(onEnd).toHaveBeenCalledTimes(1);

    cleanup();
    vi.useRealTimers();
  });

  it('cancels endDelay if property becomes observed again', () => {
    vi.useFakeTimers();
    const onEnd = vi.fn();
    const store = observable({ items: [] });

    const cleanup = lazyObserve({
      context: store,
      property: 'items',
      onStart: () => 'data',
      onEnd,
      endDelay: 300,
    });

    const { autorun } = require('mobx');
    const dispose1 = autorun(() => store.items);

    dispose1();

    vi.advanceTimersByTime(150);

    // Re-observe before the delay expires
    const dispose2 = autorun(() => store.items);

    vi.advanceTimersByTime(300);

    expect(onEnd).not.toHaveBeenCalled();

    dispose2();
    cleanup();
    vi.useRealTimers();
  });
});
