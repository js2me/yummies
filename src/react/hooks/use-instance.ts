import { useLayoutEffect } from 'react';
import { useAbortSignal } from './use-abort-signal.js';
import { useConstant } from './use-constant.js';

export type InstanceCreateConfig<TPayload, TExtension = {}> = TExtension & {
  abortSignal: AbortSignal;
  payload: TPayload;
};

/**
 * Builds a custom hook that creates an instance once and wires lifecycle helpers
 * such as an `AbortSignal` and optional extension data into the factory.
 *
 * @template TExtension Extra configuration injected into every factory call.
 * @param extension Optional static extension object merged into the factory config.
 * @returns Hook factory that creates stable instances from a supplied factory.
 *
 * @example
 * ```ts
 * const useStoreInstance = createUseInstanceHook({ api });
 * ```
 *
 * @example
 * ```ts
 * const useService = createUseInstanceHook({ logger });
 * const service = useService(({ logger, payload }) => new Service(logger, payload));
 * ```
 */
export const createUseInstanceHook =
  <TExtension = {}>(extension?: TExtension) =>
  <TInstance, TPayload>(
    factory: (
      config: InstanceCreateConfig<NoInfer<TPayload>, TExtension>,
    ) => TInstance,
    config?: {
      payload?: TPayload;
      onUpdate?: (payload: TPayload) => void;
    },
  ) => {
    const abortSignal = useAbortSignal();

    const instance = useConstant(() =>
      factory({
        ...(extension as TExtension),
        abortSignal,
        payload: config?.payload as any,
      }),
    );

    useLayoutEffect(() => {
      config?.onUpdate?.(config.payload!);
    }, [config?.payload]);

    return instance;
  };

/**
 * The `useInstance` hook is used to create and manage an instance of an object
 * that requires access to the root store and an abort signal.
 *
 * You can create YOUR OWN CUSTOM `useInstance` hook using `createUseInstanceHook` if you need
 * to provide some specific data
 *
 * @param factory - A factory function that takes a configuration and returns an instance.
 * @param config - An optional configuration containing additional input parameters and an update function.
 * @returns An instance created by the factory function.
 *
 * @example
 * ```ts
 * const service = useInstance(({ abortSignal }) => new UsersService({ abortSignal }));
 * ```
 *
 * @example
 * ```ts
 * const store = useInstance(
 *   ({ payload }) => new UserStore(payload),
 *   { payload: userId, onUpdate: (nextId) => console.log(nextId) },
 * );
 * ```
 */
export const useInstance = createUseInstanceHook();
