/**
 * InsureFlow — MetricCard.
 *
 * KPI tile: optional icon slot, big value, and a change pill whose colour
 * respects `positiveIsGood` (set it to `false` for metrics where a drop is
 * good — loss ratio, churn, cycle time). `loading` swaps the body for a
 * shimmering skeleton (`.if-skeleton`).
 */

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface MetricCardProps {
  /** Metric label, e.g. "Written premium". */
  label: string;
  /** Pre-formatted display value (use `formatCurrency` / `formatPercent`). */
  value: ReactNode;
  /** Icon slot rendered top-left (pass an icon from `@/components/icons`). */
  icon?: ReactNode;
  /** Signed change vs the comparison period (e.g. `12.4` for +12.4%). */
  change?: number | string;
  /** Text next to the change, e.g. "vs last month". */
  changeLabel?: string;
  /** Legacy alias for `change` — still used by existing pages. */
  delta?: number;
  /** Legacy alias for `changeLabel`. */
  deltaLabel?: string;
  /** Extra hint line under the value. */
  hint?: string;
  /** Direction hint for the legacy arrow glyph (`delta` only). */
  trend?: 'up' | 'down' | 'flat';
  /** When `false`, a *negative* change is rendered as good (green). */
  positiveIsGood?: boolean;
  /** Renders the shimmering skeleton instead of the content. */
  loading?: boolean;
  className?: string;
}

function formatChange(change: number | string): string {
  if (typeof change === 'string') return change;
  if (!Number.isFinite(change)) return '';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

function ChangePill({
  change,
  positiveIsGood,
  className,
}: {
  change: number | string;
  positiveIsGood: boolean;
  className?: string;
}) {
  const numeric = typeof change === 'number' ? change : Number.parseFloat(change);
  const isUp = typeof change === 'number' ? change > 0 : /^\s*\+/.test(String(change));
  const isDown = typeof change === 'number' ? change < 0 : String(change).trim().startsWith('-');
  const flat = !isUp && !isDown && (Number.isNaN(numeric) || numeric === 0);

  const good = flat ? null : isUp === positiveIsGood;
  const tone = flat
    ? 'bg-muted text-muted-foreground'
    : good
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
      : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400';
  const arrow = flat ? '→' : isUp ? '▲' : '▼';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums',
        tone,
        className
      )}
      data-good={good === null ? undefined : String(good)}
    >
      <span aria-hidden className="text-[9px] leading-none">
        {arrow}
      </span>
      {formatChange(change)}
    </span>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <span className={cn('if-skeleton block', className)} aria-hidden />;
}

export default function MetricCard({
  label,
  value,
  icon,
  change,
  changeLabel,
  delta,
  deltaLabel,
  hint,
  trend = 'flat',
  positiveIsGood = true,
  loading = false,
  className,
}: MetricCardProps) {
  const resolvedChange = change ?? delta;
  const resolvedLabel = changeLabel ?? deltaLabel;

  if (loading) {
    return (
      <div
        className={cn(
          'if-card rounded-xl p-5 transition-shadow',
          'flex flex-col gap-3',
          className
        )}
        aria-busy="true"
        aria-label={`${label} loading`}
      >
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  return (
    <div className={cn('if-card rounded-xl p-5 transition-shadow', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="if-kpi-label text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon ? (
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-if-600/10 text-if-600 dark:bg-if-500/15 dark:text-if-300">
            {icon}
          </span>
        ) : null}
      </div>

      <p className="if-kpi-value mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground">
        {value}
      </p>

      {resolvedChange !== undefined && resolvedChange !== null ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ChangePill change={resolvedChange} positiveIsGood={positiveIsGood} />
          {resolvedLabel ? (
            <span className="text-[11px] text-muted-foreground">{resolvedLabel}</span>
          ) : null}
          {/* Legacy arrow fallback when only `trend` conveys direction. */}
          {delta === undefined && change === undefined && trend !== 'flat' ? (
            <span aria-hidden className="text-xs text-muted-foreground">
              {trend === 'up' ? '↑' : '↓'}
            </span>
          ) : null}
        </div>
      ) : null}

      {hint ? <p className="mt-1.5 text-[11px] text-muted-foreground/80">{hint}</p> : null}
    </div>
  );
}
