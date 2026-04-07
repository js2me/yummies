import { _getGlobalState } from 'mobx';
import type { MobXGlobals } from 'mobx/dist/internal.js';

const DEFAULT_MAX_REACTION_ITERATIONS = 100;

/**
 * Synchronously runs MobX reactions from the internal `pendingReactions` queue when they piled up
 * during a batch (`inBatch > 0`, e.g. inside `runInAction`).
 *
 * While a batch is open, MobX only enqueues reactions; this call temporarily resets the batch
 * counter, drains the queue, and restores state—useful in tests and when you need side effects
 * before leaving the action.
 *
 * If there are no pending reactions, a reaction run is already in progress (`isRunningReactions`),
 * or the iteration cap is hit (cycle guard), there is no extra work; when the cap is exceeded the
 * queue is cleared, matching MobX's internal safety behavior.
 *
 * @param maxCount - Maximum iterations of the outer drain loop (default 100, same idea as MobX's internal limit).
 *   Pass `Number.POSITIVE_INFINITY` to disable this cap only when you trust the reaction graph to settle;
 *   a non-converging cycle will then keep looping until the queue empties (or effectively hang).
 *
 * @example
 * ```ts
 * import { observable, reaction, runInAction } from "mobx";
 * import { flushPendingReactions } from "yummies/mobx";
 *
 * const state = observable({ count: 0 });
 * const log: number[] = [];
 * reaction(() => state.count, (n) => log.push(n));
 *
 * runInAction(() => {
 *   state.count = 1;
 *   flushPendingReactions();
 * });
 *
 * // log === [1] — the reaction ran before the action finished
 * ```
 */
export function flushPendingReactions(
  maxCount = DEFAULT_MAX_REACTION_ITERATIONS,
): void {
  const gs: MobXGlobals = _getGlobalState();

  if (gs.isRunningReactions || gs.pendingReactions.length === 0) {
    return;
  }

  const savedInBatch = gs.inBatch;
  gs.inBatch = 0;

  try {
    gs.isRunningReactions = true;
    const queue = gs.pendingReactions;
    let iterations = 0;

    while (queue.length > 0) {
      if (++iterations === maxCount) {
        queue.splice(0);
        break;
      }

      const batch = queue.splice(0);
      for (let i = 0; i < batch.length; i++) {
        batch[i].runReaction_();
      }
    }
  } finally {
    gs.isRunningReactions = false;
    gs.inBatch = savedInBatch;
  }
}
