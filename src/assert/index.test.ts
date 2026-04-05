import { describe, expect, test } from 'vitest';

import { assert } from './index.js';

describe('assert', () => {
  test('ok', () => {
    expect(() => assert.ok(true)).not.toThrow();
    expect(() => assert.ok(1)).not.toThrow();
    expect(() => assert.ok('x')).not.toThrow();
  });

  test('ok throws AssertionError when falsy', () => {
    expect(() => assert.ok(false)).toThrow(assert.AssertionError);
    expect(() => assert.ok(false)).toThrow('Assertion failed');
    expect(() => assert.ok(null, 'nope')).toThrow('nope');
    expect(() => assert.ok(undefined, () => 'lazy')).toThrow('lazy');
  });

  test('invariant is ok', () => {
    expect(() => assert.invariant(true)).not.toThrow();
    expect(() => assert.invariant(false)).toThrow(assert.AssertionError);
  });

  test('defined', () => {
    expect(() => assert.defined(0)).not.toThrow();
    expect(() => assert.defined('')).not.toThrow();
    expect(() => assert.defined(null)).toThrow('Expected a defined value');
    expect(() => assert.defined(undefined, 'missing')).toThrow('missing');
  });

  test('notNull', () => {
    expect(() => assert.notNull(undefined)).not.toThrow();
    expect(() => assert.notNull(0)).not.toThrow();
    expect(() => assert.notNull(null)).toThrow('Expected a non-null value');
  });

  test('notUndefined', () => {
    expect(() => assert.notUndefined(null)).not.toThrow();
    expect(() => assert.notUndefined(0)).not.toThrow();
    expect(() => assert.notUndefined(undefined)).toThrow(
      'Expected a defined value',
    );
  });

  test('fail', () => {
    expect(() => assert.fail()).toThrow(assert.AssertionError);
    expect(() => assert.fail('stop')).toThrow('stop');
  });

  test('unreachable / never', () => {
    expect(() => assert.unreachable('x' as never)).toThrow('Unexpected value');
    expect(() => assert.never('y' as never, 'bad')).toThrow('bad');
  });

  test('instanceOf', () => {
    expect(() => assert.instanceOf(new Map(), Map)).not.toThrow();
    expect(() => assert.instanceOf({}, Map)).toThrow(assert.AssertionError);
    expect(() => assert.instanceOf({}, Map, 'not a map')).toThrow('not a map');
  });
});
