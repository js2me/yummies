/**
 * ---header-docs-section---
 * # yummies/async
 *
 * ## Description
 *
 * Helpers for asynchronous control flow: delays, cancellable waits, scheduling on the next frame,
 * and small utilities around `requestAnimationFrame` and `queueMicrotask`. They complement native
 * `Promise`/`AbortSignal` patterns and keep timing logic easy to test and tree-shake per call site.
 * Import only what you need from `yummies/async` so bundlers can drop unused helpers.
 *
 * ## Usage
 *
 * ```ts
 * import { sleep } from "yummies/async";
 * ```
 */

/**
 * Returns a promise that resolves after `time` milliseconds.
 *
 * When `signal` is passed and becomes aborted before the delay elapses, the promise
 * rejects with `signal.reason` (same as native `fetch` / `AbortController` usage).
 * The timeout is cleared on abort so no resolve happens after cancellation.
 *
 * @param time - Delay in milliseconds. Defaults to `0` (next macrotask tick, same idea as `setTimeout(0)`).
 * @param signal - Optional `AbortSignal` to cancel the wait early.
 * @returns A promise that resolves with `void` when the delay completes, or rejects if aborted.
 *
 * @example
 * Basic pause in an async function:
 * ```ts
 * await sleep(250);
 * console.log('after 250ms');
 * ```
 *
 * @example
 * Cancellable delay tied to component unmount or user action:
 * ```ts
 * const ac = new AbortController();
 * try {
 *   await sleep(5000, ac.signal);
 * } catch (e) {
 *   // aborted — e is signal.reason
 * }
 * ac.abort('user cancelled');
 * ```
 */
export const sleep = (time: number = 0, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal) {
      const abortListener = () => {
        clearTimeout(timerId);
        reject(signal?.reason);
      };
      const timerId = setTimeout(() => {
        signal.removeEventListener('abort', abortListener);
        resolve();
      }, time);
      signal.addEventListener('abort', abortListener, { once: true });
    } else {
      setTimeout(resolve, time);
    }
  });

/**
 * Creates a promise that resolves after the specified number of milliseconds.
 *
 * @deprecated Use `sleep` instead.
 * @param ms Delay in milliseconds.
 * @returns Promise
 */
export const waitAsync = async (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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

/**
 * Like `setTimeout`, but if `signal` aborts before the delay fires, the timer is cleared
 * and `callback` is never run. If the callback runs normally, the abort listener is removed.
 *
 * Does nothing special if `signal` is omitted — behaves like a plain timeout.
 *
 * @param callback - Function to run once after `delayInMs` (same as `setTimeout` callback).
 * @param delayInMs - Milliseconds to wait. Passed through to `setTimeout` (browser/Node semantics apply).
 * @param signal - When aborted, clears the pending timeout so `callback` is not invoked.
 *
 * @example
 * ```ts
 * const controller = new AbortController();
 * setAbortableTimeout(() => console.log('done'), 500, controller.signal);
 * // later: controller.abort(); // timeout cancelled, log never runs
 * ```
 *
 * @example
 * Zero-delay scheduling that can still be cancelled before the macrotask runs:
 * ```ts
 * const ac = new AbortController();
 * setAbortableTimeout(() => startIntro(), 0, ac.signal);
 * // e.g. on teardown: ac.abort();
 * ```
 */
export function setAbortableTimeout(
  callback: VoidFunction,
  delayInMs?: number,
  signal?: AbortSignal,
) {
  let internalTimer: number | null = null;

  const handleAbort = () => {
    if (internalTimer == null) {
      return;
    }
    clearTimeout(internalTimer);
    internalTimer = null;
  };

  signal?.addEventListener('abort', handleAbort, { once: true });

  internalTimer = setTimeout(() => {
    signal?.removeEventListener('abort', handleAbort);
    callback();
  }, delayInMs);
}

/**
 * Like `setInterval`, but when `signal` aborts, the interval is cleared with `clearInterval`
 * and `callback` stops being called. If `signal` is omitted, behaves like a normal interval
 * (you must clear it yourself).
 *
 * @param callback - Invoked every `delayInMs` milliseconds until aborted or cleared.
 * @param delayInMs - Interval period in milliseconds (same as `setInterval`).
 * @param signal - Aborting stops the interval and removes the abort listener path from keeping work alive.
 *
 * @example
 * ```ts
 * const controller = new AbortController();
 * setAbortableInterval(() => console.log('tick'), 1000, controller.signal);
 * // stop: controller.abort();
 * ```
 *
 * @example
 * ```ts
 * const ac = new AbortController();
 * setAbortableInterval(syncStatus, 30_000, ac.signal);
 * window.addEventListener('beforeunload', () => ac.abort());
 * ```
 */
export function setAbortableInterval(
  callback: VoidFunction,
  delayInMs?: number,
  signal?: AbortSignal,
) {
  let timer: number | null = null;

  const handleAbort = () => {
    if (timer == null) {
      return;
    }
    clearInterval(timer);
    timer = null;
  };

  signal?.addEventListener('abort', handleAbort, { once: true });

  timer = setInterval(callback, delayInMs);
}
