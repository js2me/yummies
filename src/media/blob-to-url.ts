/**
 * If `urlOrBlob` is already a string, returns it unchanged. If it is a {@link Blob}, returns
 * `URL.createObjectURL(blob)` — a short-lived `blob:` URL valid in this document until
 * {@link URL.revokeObjectURL} is called.
 *
 * Pair with {@link renderImage} or `<img src>` without re-fetching binary data. **Remember to
 * `revokeObjectURL`** when the URL is no longer needed to avoid retaining blob memory.
 *
 * @param urlOrBlob - Remote/http(s) URL string, data URL, or a `Blob` / `File`.
 * @returns A string suitable for `HTMLImageElement.src` or similar.
 *
 * @example
 * ```ts
 * const src = blobToUrl(uploadedFile);
 * img.src = src;
 * // when done:
 * URL.revokeObjectURL(src);
 * ```
 *
 * @example
 * ```ts
 * blobToUrl('https://cdn.example.com/logo.png'); // passed through as-is
 * ```
 */
export const blobToUrl = (urlOrBlob: string | Blob) =>
  urlOrBlob instanceof Blob ? URL.createObjectURL(urlOrBlob) : urlOrBlob;
