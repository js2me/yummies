/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest';

import { describe } from 'node:test';

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
});
