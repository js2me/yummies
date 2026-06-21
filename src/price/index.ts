/**
 * ---header-docs-section---
 * # yummies/price
 *
 * ## Description
 *
 * Locale-aware **money formatting** via `Intl.NumberFormat`, with optional symbol hiding and
 * custom currency symbols for legacy UI. It wraps browser i18n APIs so storefronts and dashboards
 * share one implementation for RUB/EUR/USD-style output without pulling a heavy formatting library.
 *
 * ## Usage
 *
 * ```ts
 * import { formatPrice } from "yummies/price";
 * ```
 */

export * from './format-price.js';
