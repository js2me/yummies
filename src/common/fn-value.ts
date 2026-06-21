import type { MaybeFn } from 'yummies/types';

/**
 * @deprecated use {MaybeFn} type
 */
export type FnValue<TValue, TArgs extends any[] = []> = MaybeFn<TValue, TArgs>;
