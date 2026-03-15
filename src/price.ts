export interface PriceFormatOptions
  extends Partial<Omit<Intl.NumberFormatOptions, 'currency'>> {
  withoutSymbol?: boolean;
  customSymbol?: string;
}

/**
 * Formats a numeric price using locale and currency options.
 *
 * @example
 * ```ts
 * formatPrice(1990, 'ru-RU', 'RUB');
 * ```
 */
export const formatPrice = (
  price: number,
  locale: string,
  currency?: string,
  { withoutSymbol, customSymbol, ...options }: PriceFormatOptions = {},
) => {
  const priceFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol',
    ...options,
  });

  const zeroPrice = priceFormatter.format(0);
  const currencySymbol = zeroPrice.replace('0', '');
  const rawPrice = priceFormatter.format(price);
  const priceWithoutCurrency = rawPrice.replace(currencySymbol, '');

  if (withoutSymbol) {
    return priceWithoutCurrency;
  }

  return `${priceWithoutCurrency} ${
    customSymbol ?? (currency === 'RUB' ? 'р' : currencySymbol)
  }`.replace(/\s{2,}/, ' ');
};
