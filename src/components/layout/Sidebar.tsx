'use client';

/**
 * InsureFlow — Sidebar.
 *
 * Desktop: fixed rail that collapses `w-64` → `w-20` on `lg` (state lives in
 * `SidebarContext`, so the shell can offset the main column). Mobile: a
 * drawer over a scrim. The active item is marked with a teal rail indicator.
 * A gradient "open claims" widget sits at the bottom of the rail.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  ChevronLeft,
  ChevronRight,
  Menu,
  ShieldCheck,
  X,
  getIcon,
} from '@/components/icons';
import { SIDEBAR_NAV, type NavItem } from '@/lib/constants';
import { MOCK_OPEN_CLAIMS } from '@/lib/mock-data';
import { formatCurrency, cn } from '@/lib/utils';
import { useIfSidebar } from '@/contexts/SidebarContext';

/** Constants store relative hrefs (`/claims`); routes live under `/dashboard`. */
function resolveHref(href: string): string {
  if (href === '/') return '/dashboard';
  return href.startsWith('/dashboard') ? href : `/dashboard${href}`;
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  collapsed,
  active,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = getIcon(item.icon);
  const href = resolveHref(item.href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
        'transition-colors duration-200 ease-if-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        collapsed && 'lg:justify-center lg:px-0',
        active
          ? 'bg-if-600/10 text-if-700 dark:bg-if-500/15 dark:text-if-300'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {/* Teal active rail indicator */}
      <span
        aria-hidden
        className={cn(
          'absolute -left-3 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-r-full bg-if-600 transition-all duration-200 lg:block',
          active ? 'opacity-100' : 'opacity-0'
        )}
      />
      <Icon
        className={cn(
          'h-[18px] w-[18px] shrink-0 transition-colors',
          active ? 'text-if-600 dark:text-if-400' : 'text-muted-foreground group-hover:text-foreground'
        )}
      />
      <span className={cn('truncate', collapsed && 'lg:hidden')}>{item.label}</span>
      {item.badge ? (
        <span
          className={cn(
            'ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none',
            collapsed
              ? 'lg:absolute lg:right-1.5 lg:top-1.5 lg:ml-0 lg:bg-if-600 lg:text-white lg:dark:bg-if-500 lg:dark:text-if-950'
              : '',
            active
              ? 'bg-if-600/15 text-if-700 dark:bg-if-500/20 dark:text-if-300'
              : 'bg-muted text-muted-foreground group-hover:bg-if-600/10 group-hover:text-if-700'
          )}
        >
          {item.badge}
        </span>
      ) : null}
      {item.tag ? (
        <span
          className={cn(
            'ml-auto rounded-full bg-if-600/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-if-700 dark:bg-if-500/20 dark:text-if-300',
            collapsed && 'lg:hidden'
          )}
        >
          {item.tag}
        </span>
      ) : null}
    </Link>
  );
}

function OpenClaimsWidget({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const total = MOCK_OPEN_CLAIMS.length;
  const critical = MOCK_OPEN_CLAIMS.filter((c) => c.severity === 'Critical').length;
  const reserve = MOCK_OPEN_CLAIMS.reduce((sum, claim) => sum + claim.amount, 0);

  if (collapsed) {
    return (
      <Link
        href="/dashboard/claims"
        onClick={onNavigate}
        title={`${total} open claims`}
        className="if-gradient-primary relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-if transition-transform hover:scale-105 lg:mx-auto"
      >
        <span className="text-sm font-bold tabular-nums">{total}</span>
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-300 ring-2 ring-[hsl(var(--if-sidebar))]" />
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard/claims"
      onClick={onNavigate}
      className="if-gradient-primary group block rounded-xl p-4 text-white shadow-if transition-all duration-300 hover:shadow-if-lg"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/75">
          Open claims
        </p>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
          {critical} critical
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums leading-none">{total}</p>
      <p className="mt-1.5 text-[11px] text-white/80">
        {formatCurrency(reserve, { compact: true })} reserved
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 transition-transform group-hover:translate-x-0.5">
        Review queue
        <ChevronRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function NavBody({
  collapsed,
  onNavigate,
  showCollapseToggle,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  showCollapseToggle: boolean;
}) {
  const pathname = usePathname();
  const { toggleCollapsed } = useIfSidebar();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center gap-3 border-b border-if-sidebar-border px-4',
          collapsed && 'lg:justify-center lg:px-0'
        )}
      >
        <span className="if-gradient-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-if">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <span className={cn('min-w-0', collapsed && 'lg:hidden')}>
          <span className="block truncate font-display text-[15px] font-bold leading-none text-foreground">
            InsureFlow
          </span>
          <span className="mt-1 block truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Claims OS
          </span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {SIDEBAR_NAV.map((section) => (
          <div key={section.id}>
            <p
              className={cn(
                'mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70',
                collapsed && 'lg:hidden'
              )}
            >
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                  active={isActivePath(pathname, resolveHref(item.href))}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Open claims widget (gradient card) */}
      <div className="border-t border-if-sidebar-border p-3">
        <OpenClaimsWidget collapsed={collapsed} onNavigate={onNavigate} />
      </div>

      {/* Collapse toggle (desktop only) */}
      {showCollapseToggle ? (
        <div className="hidden border-t border-if-sidebar-border p-3 lg:block">
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground',
              'transition-colors hover:bg-muted hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              collapsed && 'lg:justify-center lg:px-0'
            )}
          >
            <ChevronLeft
              className={cn('h-[18px] w-[18px] shrink-0 transition-transform', collapsed && 'lg:rotate-180')}
            />
            <span className={cn(collapsed && 'lg:hidden')}>Collapse</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const { isCollapsed, isOpen, close, isDesktop } = useIfSidebar();

  return (
    <>
      {/* ---------- Desktop rail ---------- */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-if-sidebar hidden border-r border-if-sidebar-border bg-sidebar lg:block',
          'transition-[width] duration-300 ease-if-out',
          isCollapsed ? 'w-20' : 'w-64',
          className
        )}
        aria-label="Primary navigation"
      >
        <NavBody collapsed={isCollapsed} showCollapseToggle />
      </aside>

      {/* ---------- Mobile drawer ---------- */}
      {isOpen && !isDesktop ? (
        <div className="fixed inset-0 z-if-sidebar lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] animate-if-fade-in"
          />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-if-sidebar-border bg-sidebar shadow-2xl animate-if-slide-in-left">
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
            <NavBody collapsed={false} showCollapseToggle={false} onNavigate={close} />
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Hamburger button for the mobile drawer — used by the TopBar. */
export function SidebarTrigger({ className }: { className?: string }) {
  const { open, isDesktop } = useIfSidebar();
  if (isDesktop) return null;

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open menu"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground',
        'transition-colors hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

export default Sidebar;
