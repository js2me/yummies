/**
 * ---header-docs-section---
 * # yummies/encodings
 *
 * ## Description
 *
 * String encoding utilities such as mapping Unicode text to legacy **Windows-1251** byte
 * sequences for interoperability with older backends or binary protocols. The helpers focus on
 * explicit transforms rather than implicit `TextEncoder` defaults so you can reason about output
 * in environments where charset mistakes are costly.
 *
 * ## Usage
 *
 * ```ts
 * import { unicodeToWin1251 } from "yummies/encodings";
 * ```
 */

export * from './unicode-to-win1251.js';
