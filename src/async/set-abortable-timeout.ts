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
