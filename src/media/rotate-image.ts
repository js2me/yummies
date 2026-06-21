import { degToRad } from 'yummies/math';
import { renderImage } from './render-image.js';

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
