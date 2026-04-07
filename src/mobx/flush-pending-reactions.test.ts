import { observable, reaction, runInAction } from 'mobx';
import { describe, expect, it, vi } from 'vitest';
import { flushPendingReactions } from './flush-pending-reactions';

describe('flushPendingReactions', () => {
  it('does nothing when the pending queue is empty', () => {
    expect(() => flushPendingReactions()).not.toThrow();
  });

  it('runs queued reactions synchronously inside runInAction', () => {
    const state = observable({ count: 0 });
    const spy = vi.fn();
    const dispose = reaction(() => state.count, spy);

    try {
      runInAction(() => {
        state.count = 1;
        expect(spy).not.toHaveBeenCalled();
        flushPendingReactions();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      expect(spy).toHaveBeenCalledTimes(1);
    } finally {
      dispose();
    }
  });

  it('stops after maxCount iterations when reactions keep rescheduling', () => {
    const state = observable({ x: 0 });
    const dispose = reaction(
      () => state.x,
      () => {
        state.x += 1;
      },
    );

    try {
      runInAction(() => {
        state.x = 1;
        flushPendingReactions(20);
      });
    } finally {
      dispose();
    }

    expect(state.x).toBeGreaterThan(1);
  });
});
