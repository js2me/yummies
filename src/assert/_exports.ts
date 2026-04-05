/**
 * ---header-docs-section---
 * # yummies/assert
 *
 * ## Description
 *
 * Runtime **assertions** for invariants, narrowing, and exhaustiveness. Helpers throw
 * {@link AssertionError} with an optional message (`string` or {@link MaybeFn}) so failing fast stays
 * explicit without a heavy assertion library. Use `assert.ok`, `assert.string`, `assert.defined`,
 * `assert.fail`, and the rest on the namespace export from the package entry.
 *
 * ## Usage
 *
 * ```ts
 * import { assert } from "yummies/assert";
 *
 * assert.ok(user.id, "user id is required");
 * assert.defined(maybeName);
 * assert.string(raw);
 * ```
 */

import { callFunction } from 'yummies/common';
import { typeGuard } from 'yummies/type-guard';
import type { Maybe, MaybeFn } from 'yummies/types';

/**
 * Error thrown by assertion helpers in this module.
 */
export class AssertionError extends Error {
  override name = 'AssertionError';
}

function resolveAssertMessage(
  message: MaybeFn<string> | undefined,
  fallback: string,
): string {
  if (message === undefined) {
    return fallback;
  }
  return callFunction(message);
}

/**
 * Throws when `condition` is falsy; narrows the type when it is truthy.
 *
 * @param condition Value treated as a boolean guard.
 * @param message Optional message or lazy message factory.
 *
 * @example
 * ```ts
 * assert.ok(user.id, "user id is required");
 * ```
 */
export function ok(
  condition: unknown,
  message?: MaybeFn<string>,
): asserts condition {
  if (typeGuard.isFalsy(condition)) {
    throw new AssertionError(resolveAssertMessage(message, 'Assertion failed'));
  }
}

/**
 * Same as {@link ok}; common alias for internal invariants (e.g. after optional checks).
 */
export const invariant: typeof ok = ok;

/**
 * Throws when the value is `null` or `undefined`; otherwise narrows away nullish.
 *
 * @param value Possibly nullish value.
 * @param message Optional message or lazy message factory.
 *
 * @example
 * ```ts
 * assert.defined(maybeName, "name must be present");
 * ```
 */
export function defined<T>(
  value: Maybe<T>,
  message?: MaybeFn<string>,
): asserts value is NonNullable<T> {
  if (!typeGuard.isDefined(value)) {
    throw new AssertionError(
      resolveAssertMessage(message, 'Expected a defined value'),
    );
  }
}

/**
 * Throws when the value is `null`; allows `undefined` unless combined with other checks.
 *
 * @param value Value that may be `null`.
 * @param message Optional message or lazy message factory.
 */
export function notNull<T>(
  value: T | null,
  message?: MaybeFn<string>,
): asserts value is T {
  if (typeGuard.isNull(value)) {
    throw new AssertionError(
      resolveAssertMessage(message, 'Expected a non-null value'),
    );
  }
}

/**
 * Throws when the value is `undefined`.
 *
 * @param value Value that may be `undefined`.
 * @param message Optional message or lazy message factory.
 */
export function notUndefined<T>(
  value: T | undefined,
  message?: MaybeFn<string>,
): asserts value is T {
  if (typeGuard.isUndefined(value)) {
    throw new AssertionError(
      resolveAssertMessage(message, 'Expected a defined value'),
    );
  }
}

/**
 * Throws when `value` is not a string (primitive or `String` object); uses `typeGuard.isString`.
 *
 * @param value Value to narrow.
 * @param message Optional message or lazy message factory.
 */
export function string(
  value: unknown,
  message?: MaybeFn<string>,
): asserts value is string {
  if (!typeGuard.isString(value)) {
    throw new AssertionError(
      resolveAssertMessage(message, 'Expected a string'),
    );
  }
}

/**
 * Throws when `value` is not a finite non-NaN number; uses `typeGuard.isNumber`.
 *
 * @param value Value to narrow.
 * @param message Optional message or lazy message factory.
 */
export function number(
  value: unknown,
  message?: MaybeFn<string>,
): asserts value is number {
  if (!typeGuard.isNumber(value)) {
    throw new AssertionError(
      resolveAssertMessage(message, 'Expected a finite number'),
    );
  }
}

/**
 * Throws when `value` is not a boolean; uses `typeGuard.isBoolean`.
 *
 * @param value Value to narrow.
 * @param message Optional message or lazy message factory.
 */
export function boolean(
  value: unknown,
  message?: MaybeFn<string>,
): asserts value is boolean {
  if (!typeGuard.isBoolean(value)) {
    throw new AssertionError(
      resolveAssertMessage(message, 'Expected a boolean'),
    );
  }
}

/**
 * Throws when `value` is not a symbol; uses `typeGuard.isSymbol`.
 *
 * @param value Value to narrow.
 * @param message Optional message or lazy message factory.
 */
export function symbol(
  value: unknown,
  message?: MaybeFn<string>,
): asserts value is symbol {
  if (!typeGuard.isSymbol(value)) {
    throw new AssertionError(
      resolveAssertMessage(message, 'Expected a symbol'),
    );
  }
}

/**
 * Always throws; use for branches that must be impossible or as a typed “abort”.
 *
 * @param message Optional message or lazy message factory.
 *
 * @example
 * ```ts
 * function parse(kind: "a" | "b") {
 *   if (kind === "a") return 1;
 *   if (kind === "b") return 2;
 *   assert.fail("unreachable");
 * }
 * ```
 */
export function fail(message?: MaybeFn<string>): never {
  throw new AssertionError(resolveAssertMessage(message, 'Unreachable'));
}

/**
 * Exhaustiveness helper: call with a `never` value when all union cases are handled.
 *
 * @param value Should be `never` when the type checker is satisfied.
 * @param message Optional message (this path always throws, so a lazy factory is unnecessary).
 */
export function unreachable(value: never, message?: string): never {
  throw new AssertionError(
    resolveAssertMessage(message, `Unexpected value: ${String(value)}`),
  );
}

/**
 * Alias for {@link unreachable} (common name in switch exhaustiveness snippets).
 */
export { unreachable as never };

/**
 * Throws when `value` is not an instance of `ctor`.
 *
 * @param value Value to check.
 * @param ctor Constructor used with `instanceof`.
 * @param message Optional message or lazy message factory.
 *
 * @example
 * ```ts
 * assert.instanceOf(el, HTMLElement, "expected a DOM element");
 * ```
 */
export function instanceOf<T>(
  value: unknown,
  ctor: abstract new (...args: never[]) => T,
  message?: MaybeFn<string>,
): asserts value is T {
  if (!(value instanceof ctor)) {
    throw new AssertionError(
      resolveAssertMessage(message, `Expected instance of ${ctor.name}`),
    );
  }
}
