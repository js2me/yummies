/**
 * Extracts an RGB value from any valid CSS color.
 *
 * Not recommended for frequent use because it triggers a reflow.
 */
export const getComputedColor = (color?: string): string | null => {
  if (!color) return null;

  const d = document.createElement('div');
  d.style.color = color;
  document.body.append(d);
  const rgbcolor = globalThis.getComputedStyle(d).color;
  const match =
    /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[.d+]*)*\)/g.exec(rgbcolor);

  d.remove();

  if (!match) return null;

  return `${match[1]}, ${match[2]}, ${match[3]}`;
};
