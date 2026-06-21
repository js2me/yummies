/**
 * ---header-docs-section---
 * # yummies/storage
 *
 * ## Description
 *
 * Typed helpers around **`sessionStorage`** and **`localStorage`**: key namespacing, JSON parse
 * safety, and small wrappers that avoid repeating `try/catch` around `getItem`/`setItem`. Use it when
 * you need durable client state with predictable serialization, not a full offline database.
 *
 * ## Usage
 *
 * ```ts
 * import { createKey } from "yummies/storage";
 * ```
 */

export * from './create-key.js';
export * from './create-storage.js';
export * from './storage-type.js';
