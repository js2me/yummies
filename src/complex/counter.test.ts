import { describe } from 'node:test';
import { expect, it } from 'vitest';

import { createCounter } from './counter';

describe('createCounter', () => {
  it('should have initial values', () => {
    const counter = createCounter(undefined, -1);

    expect(counter.counter).toBe(-1);
    expect(counter.value).toBe(-1);
  });

  it('should increment and update value and counter properties', () => {
    const counter = createCounter(undefined, -1);

    counter();

    expect(counter.counter).toBe(0);
    expect(counter.value).toBe(0);
  });

  it('should decrement and update value and counter properties', () => {
    const counter = createCounter(undefined, -1);

    counter.decrement();

    expect(counter.counter).toBe(-2);
    expect(counter.value).toBe(-2);
  });

  it('should increment and update processed value', () => {
    const counter = createCounter((counter) => `counter_${counter}_counter`);

    expect(counter.value).toBe(`counter_0_counter`);

    counter();

    expect(counter.value).toBe(`counter_1_counter`);
  });
});
