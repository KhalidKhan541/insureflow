/**
 * InsureFlow — Avatar.
 *
 * Initials avatar with a deterministic colour derived from the name hash, five
 * sizes and an optional presence dot. Falls back to the `if-avatar` class in
 * globals.css when no colour palette entry matches.
 */

import type { HTMLAttributes } from 'react';

import { cn, getInitials } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline' | null;

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-lg',
};

const statusClasses: Record<Exclude<AvatarStatus, null>, string> = {
  online: 'bg-emerald-500 ring-card',
  away: 'bg-amber-400 ring-card',
  busy: 'bg-red-500 ring-card',
  offline: 'bg-slate-400 ring-card',
};

const statusSize: Record<AvatarSize, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
};

/** Teal→sky→indigo→violet→amber→rose palette anchored on `#0d9488`. */
const PALETTE: { bg: string; fg: string }[] = [
  { bg: 'bg-if-600/15 text-if-700 dark:bg-if-500/25 dark:text-if-300', fg: '' },
  { bg: 'bg-sky-500/15 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300', fg: '' },
  { bg: 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-400/20 dark:text-indigo-300', fg: '' },
  { bg: 'bg-violet-500/15 text-violet-700 dark:bg-violet-400/20 dark:text-violet-300', fg: '' },
  { bg: 'bg-amber-500/20 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300', fg: '' },
  { bg: 'bg-rose-500/15 text-rose-700 dark:bg-rose-400/20 dark:text-rose-300', fg: '' },
  { bg: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300', fg: '' },
];

/** Stable FNV-1a hash so the same name always gets the same colour. */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

export function avatarColor(name: string): string {
  if (!name) return PALETTE[0].bg;
  return PALETTE[hashString(name.trim().toLowerCase()) % PALETTE.length].bg;
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Full name — initials and colour are derived from it. */
  name?: string;
  /** Explicit initials (skips derivation). */
  initials?: string;
  /** Image URL. When present the initials render as a hidden fallback. */
  src?: string | null;
  size?: AvatarSize;
  /** Presence indicator shown at the bottom-right corner. */
  status?: AvatarStatus;
  /** Ring around the avatar (useful when stacked over imagery). */
  ring?: boolean;
}

export function Avatar({
  name = '',
  initials,
  src,
  size = 'md',
  status = null,
  ring = false,
  className,
  ...props
}: AvatarProps) {
  const label = initials ?? (name ? getInitials(name) : '?');
  const colorClass = avatarColor(name || label);

  return (
    <span
      className={cn('if-avatar relative inline-flex shrink-0', sizeClasses[size], className)}
      title={name || undefined}
      {...props}
    >
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-full font-bold tracking-tight',
          colorClass,
          ring && 'ring-2 ring-card'
        )}
        aria-hidden={src ? true : undefined}
      >
        {src ? null : label}
      </span>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name || 'Avatar'}
          className="absolute inset-0 h-full w-full rounded-full object-cover"
        />
      ) : null}
      {status ? (
        <span
          aria-hidden
          className={cn(
            'absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 rounded-full ring-2 animate-if-pulse-dot',
            statusClasses[status],
            statusSize[size]
          )}
        />
      ) : null}
    </span>
  );
}

export interface AvatarGroupProps {
  names: string[];
  size?: AvatarSize;
  max?: number;
  className?: string;
}

/** Overlapping stack of avatars with a `+N` overflow chip. */
export function AvatarGroup({ names, size = 'sm', max = 4, className }: AvatarGroupProps) {
  const visible = names.slice(0, max);
  const overflow = names.length - visible.length;

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visible.map((person) => (
        <Avatar
          key={person}
          name={person}
          size={size}
          ring
          className="rounded-full bg-card"
        />
      ))}
      {overflow > 0 ? (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground ring-2 ring-card',
            sizeClasses[size]
          )}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}

export default Avatar;
