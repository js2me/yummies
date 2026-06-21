/**
 * ---header-docs-section---
 * # yummies/vibrate
 *
 * ## Description
 *
 * Thin wrapper around **`navigator.vibrate`** for mobile-style haptics: single pulses or patterned
 * on/off sequences. It no-ops when the API is missing or disabled, so UI code stays simple. Do not
 * rely on vibration for critical feedback because iOS and many desktops omit the API entirely.
 *
 * ## Usage
 *
 * ```ts
 * import { vibrate } from "yummies/vibrate";
 * ```
 */

export * from './vibrate.js';
