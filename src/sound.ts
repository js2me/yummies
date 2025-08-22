/**
 * Воспроизводит звук из файла
 */
export const playSound = async (
  file: string,
  { volume = 1 }: { volume?: number } = {},
) => {
  let audio = new Audio(file);
  audio.volume = volume;
  audio.muted = !volume;
  await audio.play();
  audio.remove();
  // @ts-ignore
  audio = null;
};
