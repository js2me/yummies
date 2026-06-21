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
