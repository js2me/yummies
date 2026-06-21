import { blobToUrl } from 'yummies/media';

/**
 * Triggers a file download by creating and clicking a temporary anchor element.
 *
 * @example
 * ```ts
 * downloadUsingAnchor('/report.pdf', 'report.pdf');
 * ```
 */
export const downloadUsingAnchor = (
  urlOrBlob: string | Blob,
  fileName?: string,
) => {
  const url = blobToUrl(urlOrBlob);

  const a = document.createElement('a');
  a.href = url;

  a.download = fileName ?? 'file';

  a.target = '_blank';

  document.body.append(a);

  a.click();

  a.remove();
};
