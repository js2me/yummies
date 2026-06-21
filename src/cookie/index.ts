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

export * from './parse-cookie.js';
