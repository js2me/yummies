/* eslint-disable sonarjs/todo-tag */
import { degToRad } from './math.js';

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const blobToUrl = (urlOrBlob: string | Blob) =>
  urlOrBlob instanceof Blob ? URL.createObjectURL(urlOrBlob) : urlOrBlob;

export const fileToBlob = (file: File) => {
  return new Blob([file], { type: file.type });
};

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
    // eslint-disable-next-line unicorn/prefer-code-point
    array[index] = bytes.charCodeAt(index);
  }

  const blob = new Blob([array], { type: base64MimeType });

  return blob;
};

/**
 * Загружает и отрисовывает изображение с использованием Image
 *
 * @returns {Promise<HTMLImageElement>}
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
  let index;

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index + 3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      }
    }
  }
  pix.x.sort(function (a, b) {
    return a - b;
  });
  pix.y.sort(function (a, b) {
    return a - b;
  });
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

/*
 * Returning object which contains base64 data and mime type of passed data url string.
 * */
export function decodeDataUrl(url: string): DecodedDataUrl {
  const regex = /^data:(.*);base64,\s?(.*)$/;
  const matches = new RegExp(regex).exec(url);

  return {
    mimeType: matches?.[1],
    data: matches?.[2],
  };
}

export const isHttpUrl = (url: string): boolean => {
  return url.startsWith('https://') || url.startsWith('http://');
};

export const isBase64Image = (str: string): boolean => {
  const { mimeType, data } = decodeDataUrl(str);
  return !!(data && mimeType?.startsWith('image/'));
};
