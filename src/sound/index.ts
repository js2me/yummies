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

export * from './play-sound.js';
