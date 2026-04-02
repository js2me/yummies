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

/**
 * Reads a file as a Base64 data URL.
 *
 * @example
 * ```ts
 * const value = await getBase64FromFile(file);
 * ```
 */
export const getBase64FromFile = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result!.toString());
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

/**
 * Reads a file as text using the provided encoding.
 *
 * @example
 * ```ts
 * const text = await getTextFromFile(file, 'utf-8');
 * ```
 */
export const getTextFromFile = (file: File, encoding?: string) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, encoding);
    reader.onload = () => {
      resolve(reader.result!.toString());
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
