/**
 * ---header-docs-section---
 * # yummies/async
 *
 * ## Description
 *
 * Helpers for asynchronous control flow: delays, cancellable waits, scheduling on the next frame,
 * and small utilities around `requestAnimationFrame` and `queueMicrotask`. They complement native
 * `Promise`/`AbortSignal` patterns and keep timing logic easy to test and tree-shake per call site.
 * Import only what you need from `yummies/async` so bundlers can drop unused helpers.
 *
 * ## Usage
 *
 * ```ts
 * import { sleep } from "yummies/async";
 * ```
 */

export * from './async-template.js';
export * from './async-template-piece.js';
export * from './endless-raf.js';
export * from './set-abortable-interval.js';
export * from './set-abortable-timeout.js';
export * from './sleep.js';
export * from './wait-async.js';
