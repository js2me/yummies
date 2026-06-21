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
