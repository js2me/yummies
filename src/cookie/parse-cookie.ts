import type { AnyObject } from 'yummies/types';

/**
 * Parses a cookie string into an object with cookie names as keys.
 *
 * @example
 * ```ts
 * parseCookie('theme=dark; token=abc');
 * ```
 */
export const parseCookie = (cookiesString = document.cookie) => {
  return cookiesString
    .split(';')
    .map((cookieString) => cookieString.trim().split('='))
    .reduce<AnyObject>((acc, current) => {
      acc[current[0]] = current[1];
      return acc;
    }, {});
};
