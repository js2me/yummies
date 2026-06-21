import { blobToUrl } from './blob-to-url.js';

/**
 * Loads a resource into a new `HTMLImageElement`: `src` is set via {@link blobToUrl} (so blobs get
 * object URLs, strings are used directly). Resolves on `load` with the same element; rejects on
 * `error` (e.g. bad URL, network failure, corrupt image) **with no rejection value**.
 *
 * Does not add the node to the DOM — use the returned element for canvas, measuring, or
 * {@link imageToBlob}.
 *
 * @param urlOrBlob - Remote URL, data URL, or `Blob` / `File`.
 * @returns Promise that fulfills with the loaded `HTMLImageElement`.
 *
 * @example
 * ```ts
 * const img = await renderImage('https://example.com/pic.png');
 * document.body.appendChild(img);
 * ```
 *
 * @example
 * ```ts
 * const img = await renderImage(pickedFile);
 * const blob = imageToBlob(img, 'image/webp');
 * ```
 */
export const renderImage = (urlOrBlob: Blob | string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = blobToUrl(urlOrBlob);
    image.onload = () => resolve(image);
    image.onerror = () => reject();
  });
