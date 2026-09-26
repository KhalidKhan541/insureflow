'use client';

/**
 * InsureFlow — TopBar.
 *
 * Sticky application header: mobile menu trigger, global search, policy-year /
 * environment pill, notification bell with unread badge + dropdown, theme
 * toggle (sun/moon) and the account avatar.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

import { Avatar } from '@/components/ui/Avatar';
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Info,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from '@/components/icons';
import { cn, formatCurrency } from '@/lib/utils';
import {
  useIfNotifications,
  type IfNotificationSeverity,
} from '@/contexts/NotificationContext';
import { useIfTheme } from '@/contexts/ThemeContext';
import { useIfSidebar } from '@/contexts/SidebarContext';
import { APP_NAME } from '@/lib/constants';

const SEVERITY_DOT: Record<IfNotificationSeverity, string> = {
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const SEVERITY_ICON: Record<IfNotificationSeverity, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: X,
};

const CURRENT_USER = { name: 'Alex Rivera', role: 'Claims lead', initials: 'AR' };

function relativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}

/* -------------------------------------------------------------------------- */
/*  Theme toggle                                                              */
/* -------------------------------------------------------------------------- */

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useIfTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground',
        'transition-colors hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
    >
      {isDark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notifications                                                             */
/* -------------------------------------------------------------------------- */

function NotificationsMenu() {
  const { notifications, unreadCount, markRead, markAllRead } = useIfNotifications();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const visible = useMemo(() => notifications.slice(0, 6), [notifications]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={
          unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
        }
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          'relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground',
          'transition-colors hover:bg-muted hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          open && 'bg-muted text-foreground'
        )}
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 py-px text-[10px] font-bold leading-none text-white ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-if-dropdown mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-popover shadow-lg animate-if-scale-in"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              <p className="text-[11px] text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
              </p>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-if-600 transition-colors hover:bg-if-600/10 hover:text-if-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Check className="h-3.5 w-3.5" />
                Mark all read
              </button>
            ) : null}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {visible.length === 0 ? (
              <li className="px-4 py-8 text-center text-xs text-muted-foreground">
                No notifications yet.
              </li>
            ) : (
              visible.map((notification) => {
                const SevIcon = SEVERITY_ICON[notification.severity] ?? Info;
                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => markRead(notification.id)}
                      className={cn(
                        'flex w-full items-start gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors last:border-0',
                        notification.read ? 'opacity-70' : 'bg-if-600/[0.04] hover:bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          notification.severity === 'success' &&
                            'bg-emerald-500/10 text-emerald-600',
                          notification.severity === 'warning' && 'bg-amber-500/10 text-amber-600',
                          notification.severity === 'danger' && 'bg-red-500/10 text-red-600',
                          notification.severity === 'info' && 'bg-sky-500/10 text-sky-600'
                        )}
                      >
                        <SevIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              'h-1.5 w-1.5 shrink-0 rounded-full',
                              SEVERITY_DOT[notification.severity]
                            )}
                          />
                          <span className="truncate text-xs font-semibold text-foreground">
                            {notification.title}
                          </span>
                        </span>
                        <span className="mt-0.5 block line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                          {notification.body}
                        </span>
                        <span className="mt-1 block text-[10px] uppercase tracking-wide text-muted-foreground/70">
                          {notification.category}
                          {notification.createdAt ? ` · ${relativeTime(notification.createdAt)}` : ''}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2.5">
            <span className="text-[11px] text-muted-foreground">
              {notifications.length} this week
            </span>
            <a
              href="/dashboard/claims"
              className="text-[11px] font-semibold text-if-600 transition-colors hover:text-if-700"
            >
              View all activity
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  TopBar                                                                    */
/* -------------------------------------------------------------------------- */

export interface TopBarProps {
  /** Rendered on mobile — opens the sidebar drawer. */
  onOpenMenu?: () => void;
  className?: string;
}

export function TopBar({ onOpenMenu, className }: TopBarProps) {
  const { isDesktop, open } = useIfSidebar();
  const env =
    process.env.NODE_ENV === 'production' ? 'Production' : 'Development';

  return (
    <header
      className={cn(
        'sticky top-0 z-if-header flex h-16 items-center gap-2 border-b border-border',
        'bg-background/85 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 sm:px-6',
        className
      )}
    >
      {/* Mobile menu trigger */}
      {!isDesktop ? (
        <button
          type="button"
          onClick={onOpenMenu ?? open}
          aria-label="Open navigation"
          className={cn(
            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground',
            'transition-colors hover:bg-muted hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
        >
          <span className="sr-only">Open navigation</span>
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      ) : null}

      {/* Search */}
      <div className="relative min-w-0 flex-1 sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search policies, claims, agents…"
          aria-label="Search"
          className={cn(
            'h-9 w-full rounded-lg border border-border bg-muted/60 pl-9 pr-14 text-sm text-foreground',
            'placeholder:text-muted-foreground/70 transition-all',
            'focus:border-if-600/60 focus:bg-background focus:outline-none focus:ring-2 focus:ring-if-600/20'
          )}
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
          ⌘K
        </kbd>
      </div>

      {/* Policy year / environment pill */}
      <span
        className="hidden items-center gap-2 rounded-full border border-if-600/25 bg-if-600/10 px-3 py-1.5 text-[11px] font-semibold text-if-700 md:inline-flex dark:bg-if-500/15 dark:text-if-300"
        title={`${APP_NAME} environment`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-if-pulse-dot rounded-full bg-emerald-500" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        FY 2026
        <span aria-hidden className="text-if-600/40 dark:text-if-400/50">
          ·
        </span>
        <span className="font-medium opacity-80">{env}</span>
      </span>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
        <span className="mr-1 hidden text-[11px] tabular-nums text-muted-foreground lg:block">
          Reserves{' '}
          {formatCurrency(1_240_000, 'USD', { notation: 'compact', maximumFractionDigits: 1 })}
        </span>
        <ThemeToggle />
        <NotificationsMenu />
        <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar name={CURRENT_USER.name} initials={CURRENT_USER.initials} size="sm" status="online" />
          <span className="hidden text-left md:block">
            <span className="block text-xs font-semibold leading-none text-foreground">
              {CURRENT_USER.name}
            </span>
            <span className="mt-1 block text-[10px] leading-none text-muted-foreground">
              {CURRENT_USER.role}
            </span>
          </span>
        </button>
      </div>
    </header>
  );
}

export default TopBar;
