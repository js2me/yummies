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
