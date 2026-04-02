/**
 * ---header-docs-section---
 * # yummies/sound
 *
 * ## Description
 *
 * One-shot HTMLAudio playback for short UI sounds (clicks, success chimes) with volume control.
 * The helper creates a temporary `Audio` element, awaits `play()`, then drops references so callers
 * do not leak nodes. Autoplay policies may still block sound until a user gesture on some browsers.
 *
 * ## Usage
 *
 * ```ts
 * import { playSound } from "yummies/sound";
 * ```
 */

/**
 * Plays a sound from a file.
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
  // @ts-expect-error
  audio = null;
};
