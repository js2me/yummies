import { getUserAgent } from './get-user-agent.js';

/**
 * Detects whether the current device should be treated as a tablet based on the user agent.
 *
 * @example
 * ```ts
 * const isTablet = checkIsTabletDevice();
 * ```
 */
export const checkIsTabletDevice = () => {
  const userAgent = getUserAgent();

  return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
    userAgent,
  );
};
