export type StorageType = 'session' | 'local';

const storages: Record<StorageType, Storage> = {
  session: sessionStorage,
  local: localStorage,
};

export const createKey = (prefix: string, key: string, namespace?: string) =>
  `${prefix}${namespace ? `/${namespace}` : ''}/${key}`;

const parseStorageValue = <V>(value: unknown): V | null => {
  if (typeof value !== 'string') {
    return value as V;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch {
    return null;
  }
};

const formatValueToStorage = (value: unknown): string => {
  return JSON.stringify(value);
};

export interface SetToStorageConfig<V>
  extends Omit<GetFromStorageConfig<V>, 'fallback'> {
  value: V;
}

export interface UnsetFromStorageConfig
  extends Omit<GetFromStorageConfig<any>, 'fallback'> {}

export interface GetFromStorageConfig<V> {
  /**
   * Storage key used to retrieve the value.
   * The full key is extended with the project namespace.
   */
  key: string;
  /**
   * Storage type.
   */
  type: StorageType;
  /**
   * Default value used when there is no value in storage.
   */
  fallback?: V;
  /**
   * Optional namespace segment used in the generated key.
   */
  namespace?: string;
  /**
   * Optional key prefix.
   */
  prefix?: string;
}

export type SetToStorageWrappedConfig<
  V,
  BaseConfig extends StorageConfigBase,
> = Omit<
  SetToStorageConfig<V>,
  Extract<keyof SetToStorageConfig<V>, keyof BaseConfig>
> &
  Partial<
    Pick<
      SetToStorageConfig<V>,
      Extract<keyof SetToStorageConfig<V>, keyof BaseConfig>
    >
  > &
  Pick<BaseConfig, Exclude<keyof BaseConfig, keyof SetToStorageConfig<V>>>;

export type UnsetFromStorageWrappedConfig<
  BaseConfig extends StorageConfigBase,
> = Omit<
  UnsetFromStorageConfig,
  Extract<keyof UnsetFromStorageConfig, keyof BaseConfig>
> &
  Partial<
    Pick<
      UnsetFromStorageConfig,
      Extract<keyof UnsetFromStorageConfig, keyof BaseConfig>
    >
  > &
  Pick<BaseConfig, Exclude<keyof BaseConfig, keyof UnsetFromStorageConfig>>;

export type GetFromStorageWrappedConfig<
  V,
  BaseConfig extends StorageConfigBase,
> = Omit<
  GetFromStorageConfig<V>,
  Extract<keyof GetFromStorageConfig<V>, keyof BaseConfig>
> &
  Partial<
    Pick<
      GetFromStorageConfig<V>,
      Extract<keyof GetFromStorageConfig<V>, keyof BaseConfig>
    >
  > &
  Pick<BaseConfig, Exclude<keyof BaseConfig, keyof GetFromStorageConfig<V>>>;

export type StorageConfigBase = Partial<
  Pick<GetFromStorageConfig<any>, 'prefix' | 'type'>
>;

export interface StorageApi<BaseConfig extends StorageConfigBase> {
  set<Value>(config: SetToStorageWrappedConfig<Value, BaseConfig>): void;
  unset(config: UnsetFromStorageWrappedConfig<BaseConfig>): void;
  get<Value>(
    config: GetFromStorageWrappedConfig<Value, BaseConfig>,
  ): Value | null;
}

/**
 * Creates an interface for working with storage (`localStorage`, `sessionStorage`).
 */
export function createStorage<BaseConfig extends StorageConfigBase>(
  storageConfig: BaseConfig,
): StorageApi<BaseConfig> {
  return {
    set: <Value>(cfg: SetToStorageWrappedConfig<Value, BaseConfig>) => {
      const config = cfg as unknown as SetToStorageConfig<Value>;
      const storageType = (config.type ?? storageConfig.type!) as StorageType;
      const storagePrefix = (config.prefix ?? storageConfig.prefix!) as string;

      const storage = storages[storageType];

      storage.setItem(
        createKey(storagePrefix, config.key, config.namespace),
        formatValueToStorage(config.value),
      );
    },
    unset: <Value>(cfg: UnsetFromStorageWrappedConfig<BaseConfig>) => {
      const config = cfg as unknown as SetToStorageConfig<Value>;
      const storageType = (config.type ?? storageConfig.type!) as StorageType;
      const storagePrefix = (config.prefix ?? storageConfig.prefix!) as string;
      const storage = storages[storageType];

      storage.removeItem(
        createKey(storagePrefix, config.key, config.namespace),
      );
    },
    get: <Value>(cfg: GetFromStorageWrappedConfig<Value, BaseConfig>) => {
      const config = cfg as unknown as GetFromStorageConfig<Value>;
      const storageType = (config.type ?? storageConfig.type!) as StorageType;
      const storagePrefix = (config.prefix ?? storageConfig.prefix!) as string;

      const storage = storages[storageType];

      return (
        parseStorageValue<Value>(
          storage.getItem(
            createKey(storagePrefix, config.key, config.namespace),
          ),
        ) ??
        config.fallback ??
        null
      );
    },
  } as const;
}
