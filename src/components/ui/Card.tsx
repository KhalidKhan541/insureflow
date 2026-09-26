/**
 * InsureFlow — Card primitives.
 *
 * `Card` owns the surface (padding, border, shadow) while `CardHeader`,
 * `CardTitle`, `CardDescription`, `CardContent` and `CardFooter` are thin
 * semantic wrappers so nested layouts stay predictable.
 *
 * Variants: default · outlined · elevated · interactive · gradient.
 */

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'interactive' | 'gradient';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual treatment of the card surface. */
  variant?: CardVariant;
  /** Removes the default `p-5` — useful when stacking full-bleed sections. */
  flush?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  /* Surface + base shadow come from `.if-card` in globals.css; no shadow utility
     here so `.if-card:hover` can still raise the resting card. */
  default: 'border border-border bg-card',
  outlined: 'border-2 border-if-600/30 bg-card shadow-none',
  elevated: 'border border-border/60 bg-card shadow-lg hover:shadow-lg',
  interactive:
    'border border-border bg-card shadow-sm transition-all duration-300 ease-if-out hover:-translate-y-0.5 hover:border-if-600/40 hover:shadow-if',
  gradient:
    'border border-transparent if-gradient-primary text-white shadow-if-lg [&_[data-if-desc]]:text-white/75 [&_[data-if-badge]]:border-white/30 [&_[data-if-badge]]:bg-white/15 [&_[data-if-badge]]:text-white',
};

export function Card({ variant = 'default', flush, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'if-card rounded-xl text-card-foreground transition-shadow',
        variantClasses[variant],
        !flush && 'p-5',
        className
      )}
      data-if-card={variant}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mb-4 flex items-start justify-between gap-3', className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-sm font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-if-desc=""
      className={cn('mt-1 text-xs leading-relaxed text-muted-foreground', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-4 flex items-center justify-between gap-3 border-t border-border pt-4',
        className
      )}
      {...props}
    />
  );
}

export interface CardSectionProps {
  /** Section heading (uses `CardTitle` styling). */
  title?: ReactNode;
  /** Supporting copy under the heading. */
  description?: ReactNode;
  /** Right-aligned controls (buttons, badges, filters). */
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/** Convenience wrapper — heading row + body in one component. */
export function CardSection({ title, description, action, className, children }: CardSectionProps) {
  return (
    <Card className={className}>
      {(title || description || action) && (
        <CardHeader>
          <div>
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action ? <div className="flex items-center gap-2">{action}</div> : null}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default Card;
