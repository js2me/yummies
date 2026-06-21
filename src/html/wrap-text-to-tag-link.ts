/**
 * Surrounds string in an anchor tag
 */
export function wrapTextToTagLink(link: string) {
  const descr = String(link).replace(/^(https?:\/{0,2})?(w{3}\.)?/, 'www.');
  if (!/^https?:\/{2}/.test(link)) link = `http://${link}`;
  return `<a href=${link} target="_blank">${descr}</a>`;
}
