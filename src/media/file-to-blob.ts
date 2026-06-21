/**
 * Creates a new {@link Blob} from a {@link File}, copying the bytes and keeping `file.type` as
 * the blob's MIME type. Handy when an API accepts `Blob` but you only have `File`, or you want a
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
