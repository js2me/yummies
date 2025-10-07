import { cva as cvaLib } from 'class-variance-authority';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Maybe } from 'yummies/utils/types';

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

/**
 * Load CSS file by providing `url`.
 *
 * **NOTE:** If `id` is provided, it will remove the existing link element with the same `id` before creating a new one.
 */
export const loadCssFile = (url: string, attrubutes?: Record<string, any>) =>
  new Promise((resolve, reject) => {
    let link: Maybe<HTMLLinkElement>;

    if (attrubutes?.id) {
      link = document.getElementById(attrubutes.id) as HTMLLinkElement | null;

      if (link) {
        link.remove();
      }
    }

    link = document.createElement('link');

    const handleLoad = () => {
      resolve(undefined);
      link!.removeEventListener('load', handleLoad);
      link!.removeEventListener('error', handleError);
    };

    const handleError = () => {
      reject(undefined);
      link!.removeEventListener('load', handleLoad);
      link!.removeEventListener('error', handleError);
    };

    link.addEventListener('load', handleLoad);
    link.addEventListener('error', handleError);

    link.setAttribute('href', url);

    if (!attrubutes?.rel) {
      link.setAttribute('rel', 'stylesheet');
    }

    Object.entries(attrubutes || {}).forEach(([key, value]) => {
      link.setAttribute(key, value);
    });

    document.head.appendChild(link);
  });
