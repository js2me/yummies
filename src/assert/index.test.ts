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

  test('string', () => {
    expect(() => assert.string('')).not.toThrow();
    expect(() => assert.string('a')).not.toThrow();
    expect(() => assert.string(1)).toThrow('Expected a string');
    expect(() => assert.string(null, 'need str')).toThrow('need str');
  });

  test('object', () => {
    expect(() => assert.object({})).not.toThrow();
    expect(() => assert.object([])).toThrow('Expected an object');
    expect(() => assert.object(1)).toThrow('Expected an object');
    expect(() => assert.object('')).toThrow('Expected an object');
    expect(() => assert.object(null, 'need obj')).toThrow('need obj');
  });

  test('array', () => {
    expect(() => assert.array([])).not.toThrow();
    expect(() => assert.array({})).toThrow('Expected an array');
    expect(() => assert.array(1)).toThrow('Expected an array');
    expect(() => assert.array('')).toThrow('Expected an array');
    expect(() => assert.array(null, 'need arr')).toThrow('need arr');
  });

  test('number', () => {
    expect(() => assert.number(0)).not.toThrow();
    expect(() => assert.number(1.5)).not.toThrow();
    expect(() => assert.number(Number.NaN)).toThrow('Expected a finite number');
    expect(() => assert.number(Infinity)).toThrow('Expected a finite number');
    expect(() => assert.number('1')).toThrow('Expected a finite number');
  });

  test('boolean', () => {
    expect(() => assert.boolean(true)).not.toThrow();
    expect(() => assert.boolean(false)).not.toThrow();
    expect(() => assert.boolean(0)).toThrow('Expected a boolean');
    expect(() => assert.boolean('true', 'b')).toThrow('b');
  });

  test('symbol', () => {
    expect(() => assert.symbol(Symbol())).not.toThrow();
    expect(() => assert.symbol(Symbol.for('x'))).not.toThrow();
    expect(() => assert.symbol('sym')).toThrow('Expected a symbol');
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
