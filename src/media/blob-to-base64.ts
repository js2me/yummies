/**
 * Reads a {@link Blob} as a **data URL** string (`data:<mime>;base64,...`) using {@link FileReader#readAsDataURL}.
 *
 * Useful for previewing uploads, embedding small assets inline, or serializing binary for APIs that
 * expect Base64-in-JSON. The result includes the MIME prefix, not raw Base64 alone — use
 * {@link decodeDataUrl} if you need the payload and type separately.
 *
 * @param blob - Any `Blob` or `File` (files are blobs).
 * @returns Resolves to the data URL string; rejects if reading fails.
 *
 * @example
 * ```ts
 * const dataUrl = await blobToBase64(file);
 * previewImg.src = dataUrl;
 * ```
 *
 * @example
 * ```ts
 * const fromFetch = await fetch('/api/export').then((r) => r.blob());
 * const dataUrl = await blobToBase64(fromFetch);
 * ```
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
