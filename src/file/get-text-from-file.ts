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
