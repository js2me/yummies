/**
 * ---header-docs-section---
 * # yummies/imports
 *
 * ## Description
 *
 * Patterns for **dynamic `import()`**: retry with backoff, unpacking `{ default }` from mixed ESM
 * shapes, and typed helpers around lazy-loaded modules. Ideal for code-split routes, optional panels,
 * and resilient loading when the network or CDN flakes without freezing the whole app.
 *
 * ## Usage
 *
 * ```ts
 * import { fetchLazyModule } from "yummies/imports";
 * ```
 */

export * from './fetch-lazy-module.js';
export * from './unpack-async-module.js';
