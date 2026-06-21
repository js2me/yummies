import type { Maybe } from 'yummies/types';

/**
 * Returns what percentage `value` is of `from`.
 * @example
 * ```ts
 * percentFrom(500, 2000) // 25
 * percentFrom(1000, 2000) // 50
 * ```
 */
export const percentFrom = (value: Maybe<number>, from: Maybe<number>) => {
  return ((value ?? 0) / (from ?? 0)) * 100 || 0;
};
