/**
 * @internal Separate chunk so clsx + tailwind-merge + class-variance-authority are tree-shaken
 * away when `cx`/`cva` are not used. Consumers import from `yummies/css` — this module is not a
 * public entry point.
 */

import { cva as cvaLib } from 'class-variance-authority';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Composes conditional class names like {@link https://github.com/lukeed/clsx | clsx}, then runs
 * the result through {@link https://github.com/dcastil/tailwind-merge | tailwind-merge} so
 * conflicting Tailwind utilities collapse to the last/intended one (e.g. two `padding-x` classes).
 *
 * Accepts the same argument shapes as `clsx`: strings, objects, arrays, falsy values to omit.
 *
 * @param args - Same as `clsx(...args)` — `ClassValue` rest parameters.
 * @returns A single merged class string, safe for `className` on DOM/React.
 *
 * @example
 * ```ts
 * cx('px-2 py-1 text-sm', 'px-4'); // 'py-1 text-sm px-4' — padding-x merged
 * ```
 *
 * @example
 * ```ts
 * cx('btn', { 'btn--active': isActive, 'btn--disabled': disabled }, className);
 * ```
 */
export const cx = (...args: Parameters<typeof clsx>) => twMerge(clsx(...args));

/**
 * {@link https://cva.style/docs | Class Variance Authority (cva)} with the same **tailwind-merge**
 * pass as {@link cx}: the class string produced by the variant function is merged so Tailwind
 * conflicts resolve predictably.
 *
 * API matches `cva` from `class-variance-authority`: optional `base` classes, `config` with
 * `variants`, `defaultVariants`, and `compoundVariants`. The returned function accepts variant
 * props plus optional `class` / `className` for one-off overrides.
 *
 * Use {@link VariantProps} with `typeof buttonVariants` (or similar) to type component props.
 *
 * @param base - Base `ClassValue`(s) always applied.
 * @param config - Variant schema and defaults (same shape as upstream `cva`).
 * @returns A function `(props?) => string` that resolves variant classes, merged with tw-merge.
 *
 * @example
 * ```ts
 * const button = cva('rounded font-medium', {
 *   variants: {
 *     tone: { primary: 'bg-blue-600 text-white', ghost: 'bg-transparent' },
 *     size: { sm: 'text-sm px-2', md: 'text-base px-4' },
 *   },
 *   defaultVariants: { tone: 'primary', size: 'md' },
 * });
 * button({ tone: 'ghost', className: 'ml-2' });
 * ```
 *
 * @example
 * ```ts
 * const card = cva('border p-4', {
 *   variants: { elevated: { true: 'shadow-lg', false: 'shadow-none' } },
 *   defaultVariants: { elevated: false },
 * });
 * card({ elevated: true });
 * ```
 */
export const cva = ((...args: any[]) => {
  const schema = cvaLib(...args);
  return (...inputArgs: any[]) => twMerge(schema(...inputArgs));
}) as unknown as typeof cvaLib;
