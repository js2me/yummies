/**
 * ---header-docs-section---
 * # yummies/random
 *
 * ## Description
 *
 * Small RNG helpers for UI demos, games, and sampling: floats, integers, and random choices from
 * arrays. They wrap `Math.random` (not cryptographically secure) so prefer platform `crypto` when
 * generating secrets, tokens, or lottery outcomes.
 *
 * ## Usage
 *
 * ```ts
 * import { getRandomInt, getRandomChoice } from "yummies/random";
 * ```
 */

export * from './get-frequency-value.js';
export * from './get-major-random-bool.js';
export * from './get-minor-random-bool.js';
export * from './get-random-bool.js';
export * from './get-random-choice.js';
export * from './get-random-float.js';
export * from './get-random-int.js';
export * from './get-random-size-array.js';
