/**
 * Склонение слова в зависимости от количества
 * @example
 * declension(1, ['слово', 'слова', 'слов']) // 'слово'
 * @example
 * declension(2, ['слово', 'слова', 'слов']) // 'слова'
 * @example
 * declension(5, ['слово', 'слова', 'слов']) // 'слов'
 */
export const declension = (
  count: number,
  txt: readonly [one: string, two: string, five: string],
  cases = [2, 0, 1, 1, 1, 2],
) =>
  txt[count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]];

/**
 * Разбиение текста на линии
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
