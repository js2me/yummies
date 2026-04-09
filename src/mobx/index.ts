/**
 * ---header-docs-section---
 * # yummies/mobx
 *
 * ## Description
 *
 * Optional MobX helpers: observable wiring, refs, lazy observation, deep structs, and low-level
 * atom utilities. Peer dependency **mobx** stays out of your bundle until you import from this
 * entry; use these helpers to reduce boilerplate around `makeObservable` and subscription lifecycles.
 *
 * ## Usage
 *
 * ```ts
 * import { applyObservable, createRef } from "yummies/mobx";
 * ```
 */

export * from './apply-observable.js';
export * from './create-enhanced-atom.js';
export * from './create-ref.js';
export * from './deep-observable-struct.js';
export * from './flush-pending-reactions.js';
export * from './get-mobx-administration.js';
export * from './get-observable-annotation.js';
export * from './lazy-observe.js';
