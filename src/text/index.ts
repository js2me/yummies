/**
 * ---header-docs-section---
 * # yummies/text
 *
 * ## Description
 *
 * Russian-centric text helpers: **declension** by count (одно слово / два слова / пять слов) and
 * utilities for splitting long strings into wrapped lines. Pair with `yummies/date-time` for
 * natural language timestamps and labels in Slavic locales.
 *
 * ## Usage
 *
 * ```ts
 * import { declension } from "yummies/text";
 * ```
 */

export * from './declension.js';
export * from './split-text-by-lines.js';
