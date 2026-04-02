/**
 * ---header-docs-section---
 * # yummies/cookie
 *
 * ## Description
 *
 * Minimal helpers for reading the browser `document.cookie` string as a plain key/value map. This
 * avoids hand-rolled splitting and trimming at every call site and keeps parsing consistent across
 * the app. It is intentionally small: set paths, `Secure`, `SameSite`, and expiry are still handled
 * by your server or `document.cookie` writes elsewhere.
 *
 * ## Usage
 *
 * ```ts
 * import { parseCookie } from "yummies/cookie";
 * ```
 */

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
