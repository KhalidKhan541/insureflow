import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format as formatFn, type Locale } from 'date-fns';

/**
 * Merge Tailwind classes with conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with locale-aware grouping and optional compact notation.
 *
 * formatNumber(1234567) => "1,234,567"
 * formatNumber(1234567, { compact: true }) => "1.2M"
 */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions & { compact?: boolean } = {}
): string {
  if (!Number.isFinite(value)) return '0';

  const { compact, ...intlOptions } = options;

  if (compact) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
      ...intlOptions,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    ...intlOptions,
  }).format(value);
}

const CURRENCY_LOCALE: Record<string, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
  CAD: 'en-CA',
  AUD: 'en-AU',
  CHF: 'de-CH',
  SGD: 'en-SG',
  INR: 'en-IN',
  AED: 'ar-AE',
  HKD: 'zh-HK',
  BRL: 'pt-BR',
  MXN: 'es-MX',
  SEK: 'sv-SE',
  NGN: 'en-NG',
};

/**
 * Format an amount as currency.
 *
 * formatCurrency(1234.5) => "$1,234.50"
 * formatCurrency(1234.5, 'EUR') => "€1.234,50"
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  options: Intl.NumberFormatOptions = {}
): string {
  if (!Number.isFinite(value)) return formatCurrency(0, currency, options);

  try {
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency] ?? 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

/**
 * Format a ratio or percentage value.
 *
 * formatPercent(0.0842) => "8.42%"
 * formatPercent(8.42, { alreadyPercent: true }) => "8.42%"
 */
export function formatPercent(
  value: number,
  options: { digits?: number; alreadyPercent?: boolean; showSign?: boolean } = {}
): string {
  const { digits = 2, alreadyPercent = false, showSign = false } = options;
  if (!Number.isFinite(value)) return '0%';

  const pct = alreadyPercent ? value : value * 100;
  const sign = showSign && pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(digits)}%`;
}

export type DateInput = string | number | Date | null | undefined;

export type DateFormatStyle =
  | 'short'
  | 'medium'
  | 'long'
  | 'time'
  | 'datetime'
  | 'iso'
  | 'month'
  | 'relative';

const DATE_PATTERNS: Record<Exclude<DateFormatStyle, 'relative' | 'iso'>, string> = {
  short: 'MMM d, yyyy',
  medium: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
  time: 'h:mm a',
  datetime: 'MMM d, yyyy h:mm a',
  month: 'MMMM yyyy',
};

/**
 * Format a date value in a friendly, consistent way. Nullish values render
 * as an em dash instead of throwing, so table cells can pass straight through.
 *
 * formatDate('2026-09-25') => "Sep 25, 2026"
 * formatDate(null) => "—"
 * formatDate(new Date(), 'relative') => "2 hours ago"
 */
export function formatDate(
  value: DateInput,
  style: DateFormatStyle = 'medium',
  locale?: Locale
): string {
  if (value === null || value === undefined || value === '') return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  if (style === 'iso') return date.toISOString();

  if (style === 'relative') {
    return formatRelativeLabel(date, locale);
  }

  return formatFn(date, DATE_PATTERNS[style], locale ? { locale } : undefined);
}

function formatRelativeLabel(date: Date, _locale?: Locale): string {
  const now = Date.now();
  const diff = date.getTime() - now;
  const abs = Math.abs(diff);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

  if (abs < minute) return rtf.format(Math.round(diff / 1000), 'second');
  if (abs < hour) return rtf.format(Math.round(diff / minute), 'minute');
  if (abs < day) return rtf.format(Math.round(diff / hour), 'hour');
  if (abs < 30 * day) return rtf.format(Math.round(diff / day), 'day');
  if (abs < 365 * day) return rtf.format(Math.round(diff / (30 * day)), 'month');
  return rtf.format(Math.round(diff / (365 * day)), 'year');
}

let idCounter = 0;

/**
 * Generate a unique, url-safe identifier.
 * Prefixed with `if_` for InsureFlow.
 */
export function generateId(prefix: string = 'if'): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}${(idCounter++).toString(36)}`;
  return `${prefix}_${random}`;
}

/**
 * Extract initials from a full name (max 2 characters).
 *
 * getInitials("Ada Lovelace") => "AL"
 */
export function getInitials(name: string, maxLength: number = 2): string {
  if (!name) return '?';
  const cleaned = name.trim().replace(/[^\p{L}\p{N}\s]/gu, ' ');
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, maxLength).toUpperCase();
  return parts
    .slice(0, maxLength)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Format a byte count into a human-readable string.
 */
export function formatBytes(bytes: number, digits: number = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : digits)} ${units[i]}`;
}

/**
 * Mask a sensitive string, keeping the tail visible.
 *
 * maskString("4242424242424242", 4) => "•••• 4242"
 */
export function maskString(value: string, keepEnd: number = 4): string {
  if (!value) return '';
  if (value.length <= keepEnd) return value;
  return `${'•'.repeat(Math.max(value.length - keepEnd, 3))}${value.slice(-keepEnd)}`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Sleep helper for simulated async work.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
