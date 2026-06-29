import { getIntlLocale, type Language } from "./languages";

export function formatDate(value: string | number | Date, options?: Intl.DateTimeFormatOptions, language?: Language): string {
  return new Intl.DateTimeFormat(getIntlLocale(language), options).format(new Date(value));
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions, language?: Language): string {
  return new Intl.NumberFormat(getIntlLocale(language), options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string,
  options?: Omit<Intl.NumberFormatOptions, "style" | "currency">,
  language?: Language,
): string {
  return formatNumber(value, { ...options, style: "currency", currency }, language);
}
