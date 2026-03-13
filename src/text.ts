/**
 * Returns the correct word form based on the provided count.
 * @example
 * declension(1, ['slovo', 'slova', 'slov']) // 'slovo'
 * @example
 * declension(2, ['slovo', 'slova', 'slov']) // 'slova'
 * @example
 * declension(5, ['slovo', 'slova', 'slov']) // 'slov'
 */
export const declension = (
  count: number,
  txt: readonly [one: string, two: string, five: string],
  cases = [2, 0, 1, 1, 1, 2],
) =>
  txt[count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]];

/**
 * Splits text into lines with a maximum line length.
 */
export const splitTextByLines = (
  text: string,
  lineLingth: number = 60,
): string[] => {
  const words = text.split(/\s+/).filter((word) => word !== '');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (word.length > lineLingth) {
      if (currentLine !== '') {
        lines.push(currentLine);
        currentLine = '';
      }

      let start = 0;
      while (start < word.length) {
        const chunk = word.slice(start, start + lineLingth);
        lines.push(chunk);
        start += lineLingth;
      }
      continue;
    }

    // Проверка возможности добавления слова в текущую строку
    if (currentLine === '') {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= lineLingth) {
      currentLine += ` ${word}`;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine !== '' || lines.length === 0) {
    lines.push(currentLine);
  }

  return lines;
};
