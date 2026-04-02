/**
 * ---header-docs-section---
 * # yummies/complex
 *
 * ## Description
 *
 * Small building blocks for app wiring: callable counters, global config slots, pub/sub buses, a
 * module factory for class-based DI, and global value handles. Everything re-exports from this
 * entry so consumers import a single path while tree-shaking drops unused modules.
 *
 * ## Usage
 *
 * ```ts
 * import { createCounter, createPubSub } from "yummies/complex";
 * ```
 */

export * from './counter.js';
export * from './global-config.js';
export * from './modules-factory.js';
export * from './pub-sub.js';
