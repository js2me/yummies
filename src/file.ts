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
