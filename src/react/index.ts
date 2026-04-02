/**
 * ---header-docs-section---
 * # yummies/react
 *
 * ## Description
 *
 * React helpers shipped as optional peer dependency: stable event callbacks (`useEvent`), refs,
 * observers (intersection, resize), abort signals, and `attachRefs` for forwarding to multiple refs.
 * Hooks follow patterns from RFCs and day-to-day UI needs without pulling a second hook library.
 * Import names directly from `yummies/react`; tree-shaking keeps unused hooks out of the bundle.
 *
 * ## Usage
 *
 * ```ts
 * import { useToggle, attachRefs } from "yummies/react";
 * ```
 */

export * from './attach-refs.js';
export * from './hooks/index.js';
