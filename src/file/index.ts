/**
 * ---header-docs-section---
 * # yummies/file
 *
 * ## Description
 *
 * Browser `File` helpers: reading contents as Base64 data URLs or plain text with optional
 * encoding. They wrap `FileReader` in promises so async flows stay linear and errors surface as
 * rejections. Handy for uploads, import wizards, and client-side parsing without extra libraries.
 *
 * ## Usage
 *
 * ```ts
 * import { getBase64FromFile } from "yummies/file";
 * ```
 */

export * from './get-base64-from-file.js';
export * from './get-text-from-file.js';
