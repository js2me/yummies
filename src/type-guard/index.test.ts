/* eslint-disable unicorn/prefer-number-properties */
/* eslint-disable unicorn/no-useless-undefined */
import { describe, expect, test } from 'vitest';

import { typeGuard } from './index.js';

describe('typeGuard', () => {
  test('isNumber', () => {
    expect(typeGuard.isNumber(1)).toBe(true);
    expect(typeGuard.isNumber(1.1)).toBe(true);
    expect(typeGuard.isNumber(NaN)).toBe(false);
    expect(typeGuard.isNumber(null)).toBe(false);
    expect(typeGuard.isNumber(undefined)).toBe(false);
    expect(typeGuard.isNumber([])).toBe(false);
    expect(typeGuard.isNumber('abb')).toBe(false);
    expect(typeGuard.isNumber(true)).toBe(false);
    expect(typeGuard.isNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(typeGuard.isNumber(Number.MIN_SAFE_INTEGER)).toBe(true);
    expect(typeGuard.isNumber(Infinity)).toBe(false);
    expect(typeGuard.isNumber(-Infinity)).toBe(false);
  });

  test('isString', () => {
    expect(typeGuard.isString('sadf')).toBe(true);
    expect(typeGuard.isString('')).toBe(true);
    expect(typeGuard.isString(null)).toBe(false);
    expect(typeGuard.isString(undefined)).toBe(false);
    expect(typeGuard.isString([])).toBe(false);
    expect(typeGuard.isString(1)).toBe(false);
    expect(typeGuard.isString(true)).toBe(false);
    expect(typeGuard.isString(Symbol())).toBe(false);
  });

  test('isBoolean', () => {
    expect(typeGuard.isBoolean(true)).toBe(true);
    expect(typeGuard.isBoolean(false)).toBe(true);
    expect(typeGuard.isBoolean(NaN)).toBe(false);
    expect(typeGuard.isBoolean(null)).toBe(false);
    expect(typeGuard.isBoolean(undefined)).toBe(false);
    expect(typeGuard.isBoolean([])).toBe(false);
    expect(typeGuard.isBoolean('tet')).toBe(false);
  });

  test('isFunction', () => {
    expect(typeGuard.isFunction(new Function())).toBe(true);
    expect(typeGuard.isFunction(() => {})).toBe(true);
    expect(typeGuard.isFunction(null)).toBe(false);
    expect(typeGuard.isFunction(undefined)).toBe(false);
    expect(typeGuard.isFunction([])).toBe(false);
    expect(typeGuard.isFunction('sdfds')).toBe(false);
    expect(typeGuard.isFunction({})).toBe(false);
  });

  test('isRegExp', () => {
    expect(typeGuard.isRegExp(/kekpek/)).toBe(true);
    expect(typeGuard.isRegExp(null)).toBe(false);
    expect(typeGuard.isRegExp(undefined)).toBe(false);
    expect(typeGuard.isRegExp([])).toBe(false);
    expect(typeGuard.isRegExp('bbaa')).toBe(false);
    expect(typeGuard.isRegExp('/bbaa/')).toBe(false);
    expect(typeGuard.isRegExp({})).toBe(false);
  });

  test('isObject', () => {
    expect(typeGuard.isObject({})).toBe(true);
    expect(typeGuard.isObject(null)).toBe(false);
    expect(typeGuard.isObject(undefined)).toBe(false);
    expect(typeGuard.isObject([])).toBe(false);
    expect(typeGuard.isObject(1)).toBe(false);
    expect(typeGuard.isObject('barbvaz')).toBe(false);
    expect(typeGuard.isObject(true)).toBe(false);
  });

  test('isElement', () => {
    expect(typeGuard.isElement(document.createElement('div'))).toBe(true);
    expect(typeGuard.isElement(null)).toBe(false);
    expect(typeGuard.isElement(undefined)).toBe(false);
    expect(typeGuard.isElement([])).toBe(false);
    expect(typeGuard.isElement('asdfadsf')).toBe(false);
    expect(typeGuard.isElement({})).toBe(false);
  });

  test('isNaN', () => {
    expect(typeGuard.isNaN(NaN)).toBe(true);
    expect(typeGuard.isNaN(0)).toBe(false);
    expect(typeGuard.isNaN(1)).toBe(false);
    expect(typeGuard.isNaN(Number.MAX_SAFE_INTEGER)).toBe(false);
    expect(typeGuard.isNaN(Number.MIN_SAFE_INTEGER)).toBe(false);
    expect(typeGuard.isNaN(Infinity)).toBe(false);
    expect(typeGuard.isNaN(-Infinity)).toBe(false);
  });

  test('isInfinite', () => {
    expect(typeGuard.isInfinite(Infinity)).toBe(true);
    expect(typeGuard.isInfinite(-Infinity)).toBe(true);
    expect(typeGuard.isInfinite(0)).toBe(false);
    expect(typeGuard.isInfinite(1)).toBe(false);
  });

  test('isSymbol', () => {
    expect(typeGuard.isSymbol(Symbol())).toBe(true);
    expect(typeGuard.isSymbol(null)).toBe(false);
    expect(typeGuard.isSymbol(undefined)).toBe(false);
    expect(typeGuard.isSymbol([])).toBe(false);
    expect(typeGuard.isSymbol('retret')).toBe(false);
    expect(typeGuard.isSymbol({})).toBe(false);
  });

  test('isDefined', () => {
    expect(typeGuard.isDefined(null)).toBe(false);
    expect(typeGuard.isDefined(undefined)).toBe(false);
    expect(typeGuard.isDefined(1)).toBe(true);
    expect(typeGuard.isDefined('ewrwr')).toBe(true);
    expect(typeGuard.isDefined({})).toBe(true);
    expect(typeGuard.isDefined([])).toBe(true);
    expect(typeGuard.isDefined(new Date())).toBe(true);
    expect(typeGuard.isDefined(Symbol())).toBe(true);
  });

  test('isArray', () => {
    expect(typeGuard.isArray([1, 2, 3])).toBe(true);
    expect(typeGuard.isArray({})).toBe(false);
    expect(typeGuard.isArray(1)).toBe(false);
    expect(typeGuard.isArray('asdfvasd')).toBe(false);
    expect(typeGuard.isArray(true)).toBe(false);
    expect(typeGuard.isArray(undefined)).toBe(false);
    expect(typeGuard.isArray(null)).toBe(false);
  });
});
