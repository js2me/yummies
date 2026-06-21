/**
 * Builds a storage key from a prefix, optional namespace and key.
 *
 * @example
 * ```ts
 * createKey('app', 'token', 'auth'); // 'app/auth/token'
 * ```
 */
export const createKey = (prefix: string, key: string, namespace?: string) =>
  `${prefix}${namespace ? `/${namespace}` : ''}/${key}`;
