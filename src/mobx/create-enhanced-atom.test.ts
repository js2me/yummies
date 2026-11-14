import { autorun } from 'mobx';
import { describe, expect, it, vi } from 'vitest';
import { createEnhancedAtom } from './create-enhanced-atom.js';

describe('createEnhancedAtom', () => {
  it('creates an atom with meta object', () => {
    const atom = createEnhancedAtom('test', undefined, undefined, {
      scope: 'users',
    });
    expect(atom.meta).toEqual({ scope: 'users' });
  });

  it('creates an atom with empty meta when not provided', () => {
    const atom = createEnhancedAtom('test');
    expect(atom.meta).toEqual({});
  });

  it('has reportChanged and reportObserved methods', () => {
    const atom = createEnhancedAtom('test');
    expect(typeof atom.reportChanged).toBe('function');
    expect(typeof atom.reportObserved).toBe('function');
  });

  it('calls onBecomeObservedHandler when atom becomes observed', () => {
    const handler = vi.fn();
    const atom = createEnhancedAtom('test', handler);

    const dispose = autorun(() => {
      atom.reportObserved();
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(atom);
    dispose();
  });

  it('calls onBecomeUnobservedHandler when atom is no longer observed', () => {
    const handler = vi.fn();
    const atom = createEnhancedAtom('test', undefined, handler);

    const dispose = autorun(() => {
      atom.reportObserved();
    });

    expect(handler).not.toHaveBeenCalled();
    dispose();

    // MobX may defer the unobserved callback
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(atom);
  });

  it('passes enhanced atom with meta to handlers', () => {
    const observedHandler = vi.fn();
    const unobservedHandler = vi.fn();
    const atom = createEnhancedAtom(
      'test',
      observedHandler,
      unobservedHandler,
      {
        id: 'custom',
      },
    );

    const dispose = autorun(() => {
      atom.reportObserved();
    });

    expect(observedHandler).toHaveBeenCalledWith(atom);
    expect(observedHandler.mock.calls[0][0].meta).toEqual({ id: 'custom' });

    dispose();
    expect(unobservedHandler).toHaveBeenCalledWith(atom);
    expect(unobservedHandler.mock.calls[0][0].meta).toEqual({ id: 'custom' });
  });

  it('reportChanged triggers reactions', () => {
    const atom = createEnhancedAtom('test');
    let count = 0;

    const dispose = autorun(() => {
      atom.reportObserved();
      count++;
    });

    expect(count).toBe(1);
    atom.reportChanged();
    expect(count).toBe(2);

    dispose();
  });
});
