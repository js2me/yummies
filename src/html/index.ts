/**
 * ---header-docs-section---
 * # yummies/html
 *
 * ## Description
 *
 * DOM-centric utilities: computed style probes, downloads via temporary anchors, view transitions,
 * and small string helpers for safe markup. Also includes HTML sanitization via DOMPurify
 * (automatically tree-shaken if `sanitizeHtml` is not used).
 *
 * ## Usage
 *
 * ```ts
 * import { getComputedColor } from "yummies/html";
 * ```
 */

export * from './calc-scrollbar-width.js';
export * from './check-element-has-parent.js';
export * from './collect-offset-top.js';
export * from './download-using-anchor.js';
export * from './get-computed-color.js';
export * from './get-element-inner-height.js';
export * from './get-element-inner-width.js';
export * from './global-scroll-into-view-for-y.js';
export * from './is-prefers-dark-theme.js';
export * from './is-prefers-light-theme.js';
export { sanitizeHtml } from './sanitize-html.js';
export * from './skip-event.js';
export * from './start-view-transition-safety.js';
export * from './wrap-text-to-tag-link.js';
