/**
 * ---header-docs-section---
 * # yummies/date-time
 *
 * ## Description
 *
 * Date and time formatting built on **dayjs** with locale plugins, human-readable presets, relative
 * phrases, and duration helpers tailored to UI copy. It composes with `yummies/format`, `yummies/ms`,
 * and `yummies/text` for declensions so timestamps read naturally in Russian-facing apps.
 *
 * ## Usage
 *
 * ```ts
 * import { formatDate } from "yummies/date-time";
 * ```
 */

export type { RawDateToFormat } from './_shared.js';
export * from './add-days.js';
export * from './add-minutes.js';
export * from './change-date.js';
export * from './day-time-duration.js';
export * from './format-date.js';
export * from './get-format-duration.js';
export * from './get-time-diff.js';
export * from './set-hours.js';
export * from './set-minutes.js';
export * from './subtract-days.js';
export * from './time-duration.js';
