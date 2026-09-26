'use client';

/**
 * InsureFlow — Button.
 *
 * Six visual variants, four sizes, optional loading state. Built on `cva`
 * (class-variance-authority) so variant/size classes are statically analyzable
 * by Tailwind. Teal (`#0d9488`, `if-600`) is the primary action colour.
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  [
    'if-btn',
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg',
    'text-sm font-semibold select-none cursor-pointer',
    'transition-all duration-200 ease-if-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
  ].join(' '),
  {
    variants: {
      variant: {
        /* teal #0d9488 */
        primary:
          'bg-if-600 text-white shadow-sm hover:bg-if-700 hover:shadow-if active:bg-if-800',
        secondary:
          'border border-border bg-secondary text-secondary-foreground hover:border-if-600/40 hover:bg-if-100 dark:hover:bg-if-950/60',
        ghost: 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
        danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800',
        outline:
          'border border-border bg-transparent text-foreground hover:border-if-600/50 hover:bg-if-50 hover:text-if-700 dark:hover:bg-if-950/40 dark:hover:text-if-300',
        gradient:
          'if-gradient-primary text-white shadow-if hover:shadow-if-lg hover:brightness-[1.06]',
      },
      size: {
        xs: 'h-7 rounded-md px-2.5 text-xs gap-1.5',
        sm: 'h-8 rounded-md px-3 text-xs gap-1.5',
        md: 'h-9 px-4 text-sm',
        lg: 'h-11 rounded-xl px-6 text-base gap-2.5',
      },
      /** Square icon-only button — pair with `size` for the hit area. */
      icon: {
        true: 'p-0 aspect-square',
        false: '',
      },
      /** Soft teal tint instead of a solid fill (used on tinted surfaces). */
      soft: {
        true: 'bg-if-600/10 text-if-700 hover:bg-if-600/15 dark:bg-if-500/15 dark:text-if-300',
        false: '',
      },
    },
    compoundVariants: [
      // Icon buttons keep a fixed square footprint at every size.
      { icon: true, size: 'xs', class: 'h-7 w-7' },
      { icon: true, size: 'sm', class: 'h-8 w-8' },
      { icon: true, size: 'md', class: 'h-9 w-9' },
      { icon: true, size: 'lg', class: 'h-11 w-11' },
      // `soft` overrides the solid fills for primary/danger.
      { soft: true, variant: 'primary', class: 'bg-if-600/10 text-if-700 hover:bg-if-600/15' },
      { soft: true, variant: 'danger', class: 'bg-red-500/10 text-red-600 hover:bg-red-500/15' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      icon: false,
      soft: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renders a spinner, sets `disabled` and `aria-busy`. */
  loading?: boolean;
  /** Node shown before the label (icon, dot, …). */
  startIcon?: ReactNode;
  /** Node shown after the label. */
  endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    icon,
    soft,
    loading = false,
    disabled,
    startIcon,
    endIcon,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, icon, soft }), className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      {...props}
    >
      {loading ? (
        <svg
          className="h-4 w-4 shrink-0 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
          <path
            d="M22 12a10 10 0 0 0-10-10"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        startIcon
      )}
      {children}
      {endIcon && !loading ? endIcon : null}
    </button>
  );
});

export default Button;
