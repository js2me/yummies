import { cva as cvaLib } from 'class-variance-authority';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ClassProp = {
  class?: ClassValue;
  className?: ClassValue;
};

type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T;

/**
 * Перевод значения в пикселях в rem строковое
 */
export const toRem = (px: number, remValue = 16) => `${px / remValue}rem`;

/**
 * classNames/clsx но с примесями tailwind-merge
 */
export const cx = (...args: Parameters<typeof clsx>) => twMerge(clsx(...args));

type ConfigSchema = Record<string, Record<string, ClassValue>>;
type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};
type ConfigVariantsMulti<T extends ConfigSchema> = {
  [Variant in keyof T]?:
    | StringToBoolean<keyof T[Variant]>
    | StringToBoolean<keyof T[Variant]>[]
    | undefined;
};
type Config<T> = T extends ConfigSchema
  ? {
      variants?: T;
      defaultVariants?: ConfigVariants<T>;
      compoundVariants?: (T extends ConfigSchema
        ? (ConfigVariants<T> | ConfigVariantsMulti<T>) & ClassProp
        : ClassProp)[];
    }
  : never;

type Props<T> = T extends ConfigSchema
  ? ConfigVariants<T> & ClassProp
  : ClassProp;

/**
 * Class Variance Authority но с примесями tailwind-merge
 *
 * https://cva.style/docs
 */
export const cva = ((...args: any[]) => {
  const schema = cvaLib(...args);
  return (...inputArgs: any[]) => twMerge(schema(...inputArgs));
}) as any as <T>(
  base?: ClassValue,
  config?: Config<T>,
) => (props?: Props<T>) => string;

export type { VariantProps } from 'class-variance-authority';
export type { ClassValue } from 'clsx';
