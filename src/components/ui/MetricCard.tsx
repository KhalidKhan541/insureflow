import { cn } from '@/lib/utils';

export interface MetricCardProps {
  label: string;
  /** Pre-formatted display value (use `formatCurrency` / `formatPercent` / `formatNumber`). */
  value: string | number;
  /** Signed change versus the comparison period. */
  delta?: number;
  deltaLabel?: string;
  hint?: string;
  trend?: 'up' | 'down' | 'flat';
  className?: string;
}

export default function MetricCard({
  label,
  value,
  delta,
  deltaLabel,
  hint,
  trend = 'flat',
  className,
}: MetricCardProps) {
  const trendStyles =
    trend === 'up'
      ? 'bg-teal-50 text-teal-700'
      : trend === 'down'
        ? 'bg-rose-50 text-rose-600'
        : 'bg-slate-100 text-slate-500';

  const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '–';

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2">
        {typeof delta === 'number' && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
              trendStyles,
            )}
          >
            <span aria-hidden>{arrow}</span>
            {delta > 0 ? '+' : ''}
            {delta.toFixed(1)}
          </span>
        )}
        {deltaLabel && <p className="text-[11px] text-slate-500">{deltaLabel}</p>}
      </div>
      {hint && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
