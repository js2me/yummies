export type PackedAsyncModule<T> = Promise<T | { default: T }>;

/**
 * Resolves either a direct value or an asynchronously imported module and unwraps its `default` export.
 *
 * @example
 * ```ts
 * const component = await unpackAsyncModule(import('./Component.ts'));
 * ```
 */
export const unpackAsyncModule = async <T>(
  maybeModule: T | PackedAsyncModule<T>,
): Promise<T> => {
  if (maybeModule instanceof Promise) {
    const data = (await maybeModule) as any;

    if ((data as any).default) {
      return (data as any).default;
    } else {
      return data;
    }
  }

  return maybeModule;
};
