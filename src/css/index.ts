/**
 * ---header-docs-section---
 * # yummies/css
 *
 * ## Description
 *
 * Styling utilities for React and plain DOM: `rem` conversion, `clsx` + `tailwind-merge` via `cx`,
 * and a `cva` bridge for variant-driven class names. The goal is predictable class strings without
 * Tailwind conflicts and with less boilerplate than concatenating strings by hand across components.
 * `cx` and `cva` are automatically tree-shaken if not used (heavy deps stay out of your bundle).
 *
 * ## Usage
 *
 * ```ts
 * import { cx, toRem } from "yummies/css";
 * ```
 */

export type { VariantProps } from 'class-variance-authority';
export type { ClassValue } from 'clsx';
export { cva, cx } from './css-cx.js';
export * from './load-css-file.js';
export * from './to-rem.js';
