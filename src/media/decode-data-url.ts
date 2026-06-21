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
