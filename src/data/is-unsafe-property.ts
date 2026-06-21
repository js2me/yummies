const UNSAFE_PROPERTY_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

/**
 * Checks whether a property key is unsafe and can lead to prototype pollution.
 *
 * @example
 * isUnsafeProperty('__proto__'); // true
 * isUnsafeProperty('name'); // false
 */
export const isUnsafeProperty = (key: any) => UNSAFE_PROPERTY_KEYS.has(key);
