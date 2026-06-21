import type { MaybeFn, Primitive } from 'yummies/types';

/**
 * A single interpolated segment in {@link asyncTemplate}.
 *
 * - **Primitives** use `String(value)` for output, except that values matching
 *   `value === null || value === undefined || value === false` yield no text (early return in `processTemplatePiece`).
 *   Other falsy values such as `0` or `''` are still stringified.
 * - **Arrays** are flattened recursively in order.
 * - **Promises** are awaited; the resolved value is processed the same way.
 * - **Async iterables of primitives** are streamed in order; each yielded value uses the same rules
 *   as a standalone primitive (`String(...)`, with `null` / `undefined` / `false` omitted).
 * - **Functions** (thunks): if the piece is a function, it is invoked with **no arguments** (`piece()`), and the return
 *   value is processed recursively—so you can defer work or return any other {@link AsyncTemplatePiece} shape
 *   (see {@link MaybeFn}). At runtime a thunk may also return a `Promise` of a piece; that is covered by
 *   {@link MaybePromise} on each template interpolation.
 */
export type AsyncTemplatePiece = MaybeFn<
  | Primitive
  | void
  | AsyncIterable<Primitive>
  | Promise<Primitive>
  | AsyncTemplatePiece[]
>;
