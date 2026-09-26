/**
 * InsureFlow — Badge.
 *
 * Status/severity pills used across claims, policies and tables.
 * Variants: default (neutral), success, warning, danger, info, secondary,
 * `if` (brand teal) plus `outline` and `destructive` aliases kept for the
 * existing page copy.
 */

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'secondary'
  | 'if'
  /* aliases */
  | 'outline'
  | 'destructive';

export type BadgeSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-if-600/10 text-if-700 ring-if-600/20 dark:bg-if-500/15 dark:text-if-300',
  success:
    'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-400/25',
  warning:
    'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/60 dark:text-amber-400 dark:ring-amber-400/25',
  danger:
    'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/60 dark:text-red-400 dark:ring-red-400/25',
  info: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-950/60 dark:text-sky-400 dark:ring-sky-400/25',
  secondary:
    'bg-muted text-muted-foreground ring-border dark:bg-muted/60 dark:ring-border/60',
  /** Brand teal — solid fill for hero/summary pills. */
  if: 'bg-if-600 text-white ring-if-600 dark:bg-if-500 dark:text-if-950',
  outline: 'bg-transparent text-foreground/70 ring-border',
  destructive:
    'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/60 dark:text-red-400 dark:ring-red-400/25',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-px text-[10px] leading-4 gap-1',
  md: 'px-2 py-0.5 text-[11px] leading-4',
  lg: 'px-2.5 py-1 text-xs leading-4',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Renders a status dot before the label. */
  dot?: boolean | string;
  children?: ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-if-badge=""
      data-variant={variant}
      className={cn(
        'if-badge inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold ring-1 ring-inset transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden
          className={cn(
            'h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70',
            typeof dot === 'string' && dot
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

export default Badge;
