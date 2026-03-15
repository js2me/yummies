import type { Maybe } from 'yummies/types';

/**
 * Converts degrees to radians.
 *
 * @example
 * ```ts
 * degToRad(180); // Math.PI
 * ```
 */
export function degToRad(deg: number) {
  return deg * (Math.PI / 180);
}

/**
 * Converts radians to degrees.
 *
 * @example
 * ```ts
 * radToDeg(Math.PI); // 180
 * ```
 */
export function radToDeg(rad: number) {
  return rad * (180 / Math.PI);
}

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
