import type { Maybe } from 'yummies/types';

/**
 * Parses JSON safely and returns a fallback value when parsing fails.
 *
 * @example
 * ```ts
 * safeJsonParse('{"enabled":true}', {}); // { enabled: true }
 * ```
 */
export const safeJsonParse = <TValue = any, TFallback = null>(
  json: Maybe<string>,
  fallback: TFallback = null as TFallback,
): TValue | TFallback => {
  if (json == null) return fallback;

  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};
