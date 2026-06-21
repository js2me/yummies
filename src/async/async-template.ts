import type { MaybePromise } from 'yummies/types';

import type { AsyncTemplatePiece } from './async-template-piece.js';

/**
 * Tagged template that builds an async iterable of string chunks (like a streaming template engine).
 *
 * Static template parts are yielded as-is. Each interpolated “piece” can be a primitive, a nested array of pieces,
 * a `Promise` of a piece (including a resolved primitive), an async iterable of primitives, or a
 * **zero-arg function** whose result is processed the same way (see {@link AsyncTemplatePiece} / `MaybeFn`).
 *
 * Interpolation handling matches `processTemplatePiece`: `null`, `undefined`, and `false` add nothing; any other value
 * becomes text via `String(...)`; functions are called once with no arguments before further processing. Collect chunks
 * with `for await...of` or utilities like `Array.fromAsync` where available.
 *
 * @param strings - Cooked template segments from the tag (`strings[0]`, `strings[1]`, …).
 * @param pieces - Values between segments (`pieces[i]` sits between `strings[i]` and `strings[i + 1]`).
 * @returns An async generator yielding string fragments in document order.
 *
 * @example
 * Plain values and promises:
 * ```ts
 * const gen = asyncTemplate`Hello, ${'world'}! Status: ${Promise.resolve(200)}`;
 * let out = '';
 * for await (const chunk of gen) out += chunk;
 * // out === 'Hello, world! Status: 200'
 * ```
 *
 * @example
 * Falsy pieces are omitted (`null`, `undefined`, `false`); arrays flatten recursively:
 * ```ts
 * const gen = asyncTemplate`${null}${false}A${['B', ['C']]}`;
 * const out = await Array.fromAsync(gen).then((parts) => parts.join(''));
 * // out === 'ABC'
 * ```
 *
 * @example
 * Stream from an async iterable (e.g. chunked upstream text):
 * ```ts
 * async function* lines() {
 *   yield 'line1\n';
 *   yield 'line2\n';
 * }
 * const gen = asyncTemplate`Header\n${lines()}Footer`;
 * ```
 *
 * @example
 * Lazy piece via a thunk (invoked as `piece()`):
 * ```ts
 * let n = 0;
 * const gen = asyncTemplate`count=${() => ++n}`;
 * // first consumption yields "count=1", etc.
 * ```
 */
export async function* asyncTemplate(
  strings: TemplateStringsArray,
  ...pieces: MaybePromise<AsyncTemplatePiece>[]
) {
  for (let i = 0; i < strings.length; i++) {
    yield strings[i];

    if (i < pieces.length) {
      const piece = pieces[i];
      yield* processTemplatePiece(piece);
    }
  }
}

/**
 * Resolves a template piece into yielded string chunks.
 *
 * Skips output when `value === null || value === undefined || value === false`.
 * Otherwise awaits promises, flattens arrays, streams async iterables, invokes **functions** with no arguments and
 * recurses on the return value, and uses `String(value)` for primitives.
 */
async function* processTemplatePiece(
  piece: MaybePromise<AsyncTemplatePiece>,
): AsyncGenerator<string, void, unknown> {
  if (piece === null || piece === undefined || piece === false) {
    return;
  }

  if (piece instanceof Promise) {
    const resolved = await piece;
    yield* processTemplatePiece(resolved);
    return;
  }

  if (Array.isArray(piece)) {
    for (const item of piece) {
      yield* processTemplatePiece(item);
    }
    return;
  }

  if (
    typeof piece === 'object' &&
    piece !== null &&
    typeof (piece as AsyncIterable<unknown>)[Symbol.asyncIterator] ===
      'function'
  ) {
    for await (const item of piece as AsyncIterable<AsyncTemplatePiece>) {
      yield* processTemplatePiece(item);
    }
    return;
  }

  if (typeof piece === 'function') {
    yield* processTemplatePiece(piece());
    return;
  }

  yield String(piece);
}
