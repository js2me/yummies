import { cva as cvaLib } from 'class-variance-authority';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Maybe } from 'yummies/types';

type ClassProp = {
  class?: ClassValue;
  className?: ClassValue;
};

type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T;

/**
 * Converts a length in **pixels** to a CSS **`rem`** string (`"<number>rem"`).
 *
 * Use when authoring component styles in JS/TS where design tokens are in px but the stylesheet
 * should scale with root font size (accessibility, user zoom). `remValue` is the assumed
 * `1rem` size in px (browser default is typically `16`).
 *
 * @param px - Pixel value to convert (not rounded; stringification keeps full float).
 * @param remValue - How many pixels one `rem` equals. Defaults to `16`.
 * @returns A string like `"1.5rem"` suitable for `style` or CSS-in-JS.
 *
 * @example
 * ```ts
 * const width = toRem(24); // '1.5rem' with default 16px root
 * ```
 *
 * @example
 * ```ts
 * // Custom root / design system where 1rem === 10px
 * const gap = toRem(20, 10); // '2rem'
 * ```
 */
export const toRem = (px: number, remValue = 16) => `${px / remValue}rem`;

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
}) as any as <T>(
  base?: ClassValue,
  config?: Config<T>,
) => (props?: Props<T>) => string;

/**
 * Utility type from `class-variance-authority`: infers the variant prop object from a `cva` instance.
 * Use it to type React (or other) components that forward variant props.
 *
 * @example
 * ```ts
 * const input = cva('border', { variants: { size: { sm: 'h-8', lg: 'h-12' } } });
 * type InputVariants = VariantProps<typeof input>;
 * // { size?: 'sm' | 'lg' | null }
 * ```
 */
export type { VariantProps } from 'class-variance-authority';

/**
 * Re-export from `clsx`: a class name fragment — string, number, nested arrays, object map of
 * flags, or falsy nodes to skip. Used by {@link cx}, {@link cva}, and typical `className` helpers.
 *
 * @example
 * ```ts
 * const value: ClassValue = ['btn', false && 'hidden', { active: true }];
 * ```
 */
export type { ClassValue } from 'clsx';

/**
 * Injects a stylesheet by appending a `<link rel="stylesheet">` to `document.head`.
 * Resolves when the sheet fires `load`; rejects on `error` (e.g. 404 or network failure).
 *
 * **Id replacement:** if `attrubutes.id` is set, any existing element with that `id` is removed
 * first, so repeated calls with the same `id` replace the previous link (useful for theme or
 * font URLs that change).
 *
 * If `rel` is omitted in `attrubutes`, it defaults to `stylesheet`. Other attributes (`crossorigin`,
 * `media`, `data-*`, etc.) are set via `setAttribute` from the record entries.
 *
 * @param url - Stylesheet URL (`href`).
 * @param attrubutes - Optional HTML attributes for the `<link>` element (see `id` / `rel` behavior above).
 * @returns Promise that resolves to `undefined` on load, or rejects on load error.
 *
 * @example
 * ```ts
 * await loadCssFile('https://example.com/fonts.css', {
 *   id: 'app-fonts',
 *   crossOrigin: 'anonymous',
 * });
 * ```
 *
 * @example
 * ```ts
 * // Swap theme stylesheet without duplicate link tags
 * await loadCssFile('/themes/dark.css', { id: 'theme' });
 * await loadCssFile('/themes/light.css', { id: 'theme' });
 * ```
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
