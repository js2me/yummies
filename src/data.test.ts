/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest';

import { describe } from 'node:test';

import { isShallowEqual } from './data';

describe('data tests', () => {
  describe('isShallowEqual', () => {
    it('two nulls', () => {
      expect(isShallowEqual(null, null)).toBeTruthy();
    });

    it('two undefineds', () => {
      expect(isShallowEqual(undefined, undefined)).toBeTruthy();
    });

    it('two empty objects', () => {
      expect(isShallowEqual({}, {})).toBeTruthy();
    });

    it('two empty arrays', () => {
      expect(isShallowEqual([], [])).toBeTruthy();
    });

    it('two empty arrays with different length', () => {
      expect(isShallowEqual([1], [])).toBeFalsy();
    });

    it('two arrays with same values', () => {
      expect(isShallowEqual([1, 2, 3], [1, 2, 3])).toBeTruthy();
    });

    it('two arrays with different order', () => {
      expect(isShallowEqual([1, 2, 3], [3, 2, 1])).toBeFalsy();
    });

    it('two arrays with different length', () => {
      expect(isShallowEqual([1, 2, 3], [1, 2, 3, 4])).toBeFalsy();
    });

    it('two objects with same keys and values', () => {
      expect(isShallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBeTruthy();
    });

    it('two objects with same keys and values in different order', () => {
      expect(isShallowEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBeTruthy();
    });

    it('two objects with different keys', () => {
      expect(isShallowEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBeFalsy();
    });

    it('two objects with same keys and different values', () => {
      expect(isShallowEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBeFalsy();
    });

    it('two objects with same keys, different values and different order', () => {
      expect(isShallowEqual({ a: 1, b: 2 }, { b: 3, a: 1 })).toBeFalsy();
    });

    it('two objects with extra key on first object', () => {
      expect(isShallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toBeFalsy();
    });

    it('two objects with extra key on second object', () => {
      expect(isShallowEqual({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toBeFalsy();
    });
    it('first is null, second is object', () => {
      expect(isShallowEqual(null, { a: 1 })).toBeFalsy();
    });

    it('first is object, second is null', () => {
      expect(isShallowEqual({ a: 1 }, null)).toBeFalsy();
    });

    it('first is undefined, second is object', () => {
      expect(isShallowEqual(undefined, { a: 1 })).toBeFalsy();
    });

    it('first is object, second is undefined', () => {
      expect(isShallowEqual({ a: 1 }, undefined)).toBeFalsy();
    });
  });
});
