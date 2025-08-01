import { cva as cvaLib } from 'class-variance-authority';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Перевод значения в пикселях в rem строковое
 */
export const toRem = (px: number, remValue = 16) => `${px / remValue}rem`;

/**
 * classNames/clsx но с примесями tailwind-merge
 */
export const cx = (...args: Parameters<typeof clsx>) => twMerge(clsx(...args));

/**
 * Class Variance Authority но с примесями tailwind-merge
 *
 * https://cva.style/docs
 */
export const cva = ((...args: any[]) => {
  const schema = cvaLib(...args);
  return (...inputArgs: any[]) => twMerge(schema(...inputArgs));
}) as any as typeof cvaLib;

export type { VariantProps } from 'class-variance-authority';
