import { degToRad } from 'yummies/math';

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

/**
 * Creates a new {@link Blob} from a {@link File}, copying the bytes and keeping `file.type` as
 * the blob’s MIME type. Handy when an API accepts `Blob` but you only have `File`, or you want a
 * plain blob without the `File` name/lastModified metadata.
 *
 * @param file - Source file from an `<input type="file">` or drag-and-drop.
 * @returns A `Blob` with the same content and `type` as the file.
 *
 * @example
 * ```ts
 * const blob = fileToBlob(fileFromInput);
 * await uploadEndpoint(blob);
 * ```
 *
 * @example
 * ```ts
 * const blob = fileToBlob(imageFile);
 * const url = URL.createObjectURL(blob);
 * ```
 */
export const fileToBlob = (file: File) => {
  return new Blob([file], { type: file.type });
};

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

function cropImageFromCanvas(context: CanvasRenderingContext2D) {
  const canvas = context.canvas;
  let w = canvas.width;
  let h = canvas.height;
  const pix: { x: number[]; y: number[] } = { x: [], y: [] };
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let x: number;
  let y: number;
  let index: number;

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index + 3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      }
    }
  }
  pix.x.sort((a, b) => a - b);
  pix.y.sort((a, b) => a - b);
  const n = pix.x.length - 1;

  w = 1 + pix.x[n] - pix.x[0];
  h = 1 + pix.y[n] - pix.y[0];
  const cut = context.getImageData(pix.x[0], pix.y[0], w, h);

  canvas.width = w;
  canvas.height = h;
  context.putImageData(cut, 0, 0);
  return canvas;
}

// TODO: ломает iphone с огромными изображениями
/**
 * Rotates `image` around its center on a square canvas (side = max(width, height)), then **crops**
 * transparent margins by trimming to the bounding box of pixels with non-zero alpha.
 * Returns a **new** loaded `HTMLImageElement` (PNG data URL under the hood via {@link renderImage}).
 *
 * `angle` is in **degrees**; converted with {@link degToRad} from `yummies/math`.
 *
 * Very large sources can stress memory on some mobile browsers (known iPhone issues — see TODO in source).
 *
 * @param image - Source image (should be decoded; uses `width` / `height`).
 * @param angle - Rotation in degrees (e.g. `90` for quarter turn).
 * @returns Promise of a new `HTMLImageElement` showing the rotated, cropped result.
 *
 * @example
 * ```ts
 * const upright = await rotateImage(landscapeImg, 90);
 * ```
 *
 * @example
 * ```ts
 * const fixed = await rotateImage(await renderImage(file), -15);
 * ```
 */
export const rotateImage = (image: HTMLImageElement, angle: number) => {
  const maxSize = Math.max(image.width, image.height);
  const canvas = document.createElement('canvas');
  canvas.width = maxSize;
  canvas.height = maxSize;
  const context = canvas.getContext('2d')!;
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(degToRad(angle));
  context.drawImage(image, -image.width / 2, -image.height / 2);
  context.restore();
  cropImageFromCanvas(context);
  return renderImage(canvas.toDataURL('image/png'));
};

interface DecodedDataUrl {
  mimeType?: string;
  data?: string;
}

/**
 * Parses a `data:` URL of the form `data:<mime>;base64,<payload>` into its MIME type and raw
 * Base64 body (without the `data:...;base64,` prefix). Non-matching strings yield `undefined`
 * fields in the result object.
 *
 * @param url - Full data URL string.
 * @returns `{ mimeType, data }` — both optional when the regex does not match.
 *
 * @example
 * ```ts
 * const { mimeType, data } = decodeDataUrl('data:image/png;base64,iVBORw0KGgo=');
 * // mimeType === 'image/png', data === 'iVBORw0KGgo='
 * ```
 *
 * @example
 * ```ts
 * decodeDataUrl('not-a-data-url'); // { mimeType: undefined, data: undefined }
 * ```
 */
export function decodeDataUrl(url: string): DecodedDataUrl {
  const regex = /^data:(.*);base64,\s?(.*)$/;
  const matches = new RegExp(regex).exec(url);

  return {
    mimeType: matches?.[1],
    data: matches?.[2],
  };
}

/**
 * Returns `true` if `url` starts with `https://` or `http://` (case-sensitive, as in
 * `String#startsWith`). Does not validate that the rest is a well-formed URL — only the scheme
 * prefix. `blob:`, `data:`, and relative paths return `false`.
 *
 * @param url - String to test (often a user-provided or configured href).
 *
 * @example
 * ```ts
 * isHttpUrl('https://example.com/path'); // true
 * isHttpUrl('http://localhost:3000'); // true
 * ```
 *
 * @example
 * ```ts
 * isHttpUrl('//cdn.example.com'); // false — no explicit http(s) prefix
 * isHttpUrl('/assets/logo.png'); // false — relative path
 * ```
 */
export const isHttpUrl = (url: string): boolean => {
  return url.startsWith('https://') || url.startsWith('http://');
};

/**
 * Returns `true` when `str` is a data URL that {@link decodeDataUrl} can parse **and** the MIME
 * type starts with `image/` (e.g. `image/png`, `image/jpeg`). Requires both a non-empty Base64
 * payload and an image MIME — arbitrary `data:text/plain;base64,...` is `false`.
 *
 * @param str - Candidate string (often `img.src` or API payload).
 *
 * @example
 * ```ts
 * isBase64Image('data:image/png;base64,iVBORw0KGgo='); // true
 * ```
 *
 * @example
 * ```ts
 * isBase64Image('https://example.com/x.png'); // false
 * isBase64Image('data:text/plain;base64,SGk='); // false
 * ```
 */
export const isBase64Image = (str: string): boolean => {
  const { mimeType, data } = decodeDataUrl(str);
  return !!(data && mimeType?.startsWith('image/'));
};
