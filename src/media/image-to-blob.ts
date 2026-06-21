/**
 * Draws an {@link HTMLImageElement} onto an offscreen canvas, then builds a {@link Blob} from the
 * raster (via `canvas.toDataURL` + binary decode). Dimensions use `naturalWidth` / `naturalHeight`,
 * falling back to `300×300` if those are zero (e.g. not yet decoded).
 *
 * **CORS:** if the image is cross-origin without proper CORS headers, the canvas may be
 * *tainted* and `toDataURL` can throw — same browser rules as any canvas export.
 *
 * @param imageElement - Loaded image (`complete` / decoded recommended).
 * @param mimeType - Output MIME type, e.g. `'image/png'` (default) or `'image/jpeg'`. Encoder support is browser-dependent.
 * @returns Encoded image as a `Blob` with a matching `type` when possible.
 *
 * @example
 * ```ts
 * const img = await renderImage('/photo.jpg');
 * const jpegBlob = imageToBlob(img, 'image/jpeg');
 * ```
 *
 * @example
 * ```ts
 * const pngBlob = imageToBlob(cachedImg); // default image/png
 * ```
 */
export const imageToBlob = (
  imageElement: HTMLImageElement,
  mimeType: string = 'image/png',
) => {
  const canvas = document.createElement('canvas');

  canvas.width = imageElement.naturalWidth || 300;
  canvas.height = imageElement.naturalHeight || 300;

  canvas.getContext('2d')!.drawImage(imageElement, 0, 0);

  const dataUri = canvas.toDataURL(mimeType, 1);
  const base64data = dataUri.split(',')[1];
  const base64MimeType = dataUri.split(';')[0].slice(5);

  const bytes = globalThis.atob(base64data);
  const buf = new ArrayBuffer(bytes.length);
  const array = new Uint8Array(buf);

  for (let index = 0; index < bytes.length; index++) {
    array[index] = bytes.charCodeAt(index);
  }

  const blob = new Blob([array], { type: base64MimeType });

  return blob;
};
