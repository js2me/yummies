import { checkIsMobileDevice } from './check-is-mobile-device.js';
import { checkIsTabletDevice } from './check-is-tablet-device.js';

/**
 * Detects whether the current device supports a touch-first form factor.
 *
 * @example
 * ```ts
 * const isTouch = checkIsTouchDevice();
 * ```
 */
export const checkIsTouchDevice = () =>
  checkIsMobileDevice() || checkIsTabletDevice();
