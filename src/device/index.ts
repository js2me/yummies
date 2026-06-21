/**
 * ---header-docs-section---
 * # yummies/device
 *
 * ## Description
 *
 * Lightweight user-agent sniffing for product UI: mobile/tablet heuristics and a normalized UA
 * string accessor. These checks are best-effort (browsers spoof and evolve) and should gate only
 * non-critical layout or analytics, never security. Prefer feature detection when the platform API
 * is what you actually need.
 *
 * ## Usage
 *
 * ```ts
 * import { checkIsMobileDevice, getUserAgent } from "yummies/device";
 * ```
 */

export * from './check-is-mobile-device.js';
export * from './check-is-tablet-device.js';
export * from './check-is-touch-device.js';
export * from './get-user-agent.js';
export * from './is-mobile-device.js';
export * from './is-tablet-device.js';
export * from './is-touch-device.js';
