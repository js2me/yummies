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

/**
 * Triggers haptic feedback via the {@link https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API | Vibration API}
 * when `navigator.vibrate` exists (common on Android Chrome; often missing on iOS Safari / desktop).
 *
 * - **Single number** — vibrate for that many milliseconds, then stop.
 * - **Array of numbers** — alternating vibration and pause lengths in ms: `[vibrate, pause, vibrate, ...]`.
 *   Per the spec, values are clamped; odd-length arrays imply a trailing vibrate segment.
 *
 * If the API is unavailable or the user has disabled vibration, this function **does nothing**
 * (no throw). Call sites should not rely on vibration for critical UX.
 *
 * @param pattern - Duration in ms, or a pattern array as described above.
 *
 * @example
 * Short confirmation buzz (200 ms):
 * ```ts
 * vibrate(200);
 * ```
 *
 * @example
 * Double-pulse pattern: 100 ms on, 50 ms off, 100 ms on:
 * ```ts
 * vibrate([100, 50, 100]);
 * ```
 */
export const vibrate = (pattern: number | number[]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};
