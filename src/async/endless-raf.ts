/**
 * Runs a loop driven by `requestAnimationFrame`: on each frame, `quitFunction` is called first.
 * If it returns a truthy value, the loop stops and no further frames are scheduled.
 * If it returns falsy or nothing, the next frame is scheduled recursively.
 *
 * Use this for per-frame work (animations, layout reads after paint) without managing
 * `cancelAnimationFrame` manually — returning `true` from `quitFunction` is the exit condition.
 *
 * When `asMicrotask` is `true`, scheduling the next RAF is deferred with `queueMicrotask`
 * so other microtasks can run before the frame is requested (useful when you need to
 * batch DOM updates or let reactive frameworks flush first).
 *
 * @param quitFunction - Invoked each animation frame. Return `true` to stop the loop.
 * @param asMicrotask - If `true`, wrap the `requestAnimationFrame` call in `queueMicrotask`.
 *
 * @example
 * Stop after 60 frames (~1s at 60Hz):
 * ```ts
 * let frames = 0;
 * endlessRAF(() => {
 *   frames++;
 *   updateSomething(frames);
 *   return frames >= 60;
 * });
 * ```
 *
 * @example
 * Run until an element is removed or a flag is set:
 * ```ts
 * let running = true;
 * endlessRAF(() => {
 *   if (!running || !document.body.contains(el)) return true;
 *   draw(el);
 * }, true);
 * ```
 */
export const endlessRAF = (
  quitFunction: () => boolean | void,
  asMicrotask?: boolean,
) => {
  if (quitFunction()) return;

  const raf = () =>
    requestAnimationFrame(() => endlessRAF(quitFunction, asMicrotask));

  if (asMicrotask) {
    queueMicrotask(raf);
  } else {
    raf();
  }
};
