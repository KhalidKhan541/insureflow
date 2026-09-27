'use client';

import { useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_AGENTS, MOCK_RENEWALS } from '@/lib/mock-data';
import { cn, formatCurrency, formatDate, formatNumber, formatPercent } from '@/lib/utils';

/** Fixed reference date keeps the renewal countdowns deterministic in this demo. */
const TODAY_UTC = Date.UTC(2026, 8, 27);
const DAY_MS = 86_400_000;

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

const STATUS_META: Record<string, { label: string; variant: BadgeVariant }> = {
  scheduled: { label: 'Auto-renew', variant: 'default' },
  notice_sent: { label: 'Quote sent', variant: 'warning' },
  quoted: { label: 'Quoted', variant: 'secondary' },
  accepted: { label: 'Accepted', variant: 'success' },
  declined: { label: 'Declined', variant: 'destructive' },
  lapsed: { label: 'Lapsed', variant: 'destructive' },
};

/** Filter value → underlying renewal status. */
const STATUS_FILTERS: { value: string; label: string; status: string }[] = [
  { value: 'auto-renew', label: 'Auto-renew', status: 'scheduled' },
  { value: 'quote-sent', label: 'Quote sent', status: 'notice_sent' },
  { value: 'quoted', label: 'Quoted', status: 'quoted' },
  { value: 'lapsed', label: 'Lapsed', status: 'lapsed' },
  { value: 'accepted', label: 'Accepted', status: 'accepted' },
  { value: 'declined', label: 'Declined', status: 'declined' },
];

const RISK_LABEL: Record<string, string> = {
  low: 'Low lapse risk',
  medium: 'Medium lapse risk',
  high: 'High lapse risk',
};

const RISK_VARIANT: Record<string, BadgeVariant> = {
  low: 'success',
  medium: 'warning',
  high: 'destructive',
};

function statusMeta(value: string) {
  return STATUS_META[value] ?? { label: value, variant: 'secondary' as BadgeVariant };
}

/** Whole days from the demo "today" to the renewal date (negative = overdue). */
function daysUntil(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return 0;
  return Math.round((Date.UTC(year, month - 1, day) - TODAY_UTC) / DAY_MS);
}

/** Colour-coded countdown: overdue/today red, ≤14 days amber, otherwise teal. */
function countdownTone(days: number): { text: string; className: string; dot: string } {
  if (days < 0) {
    return { text: `${Math.abs(days)}d overdue`, className: 'text-rose-600', dot: 'bg-rose-500' };
  }
  if (days === 0) return { text: 'Today', className: 'text-rose-600', dot: 'bg-rose-500' };
  if (days <= 14) {
    return { text: `in ${days}d`, className: 'text-amber-600', dot: 'bg-amber-500' };
  }
  if (days <= 45) {
    return { text: `in ${days}d`, className: 'text-teal-600', dot: 'bg-teal-500' };
  }
  return { text: `in ${days}d`, className: 'text-slate-500', dot: 'bg-slate-400' };
}

function matches(value: string | undefined | null, term: string): boolean {
  if (!term) return true;
  return (value ?? '').toLowerCase().includes(term);
}

export default function RenewalsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  /** Local overrides so the retention actions feel interactive in the demo. */
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [reminded, setReminded] = useState<Record<string, boolean>>({});

  const statusOf = (id: string, fallback: string) => overrides[id] ?? fallback;

  const stats = useMemo(() => {
    const rows = MOCK_RENEWALS.map((renewal) => ({
      ...renewal,
      status: statusOf(renewal.id, renewal.status),
    }));
    const retained = rows.filter((row) => row.status === 'accepted');
    const lapsed = rows.filter((row) => row.status === 'lapsed' || row.status === 'declined');
    const open = rows.filter(
      (row) => row.status === 'scheduled' || row.status === 'notice_sent' || row.status === 'quoted',
    );
    const dueSoon = rows.filter((row) => {
      const days = daysUntil(row.renewalDate);
      return days >= 0 && days <= 30;
    });
    const currentPremium = rows.reduce((sum, row) => sum + row.currentPremium, 0);
    const renewalPremium = rows.reduce((sum, row) => sum + row.renewalPremium, 0);
    const decided = retained.length + lapsed.length;
    return {
      total: rows.length,
      retained: retained.length,
      lapsed: lapsed.length,
      open: open.length,
      dueSoon: dueSoon.length,
      currentPremium,
      renewalPremium,
      delta: renewalPremium - currentPremium,
      retentionRate: decided > 0 ? retained.length / decided : 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides]);

  /** Book-wide retention, averaged across the agent roster. */
  const agentRetention =
    MOCK_AGENTS.reduce((sum, agent) => sum + agent.retentionRate, 0) / (MOCK_AGENTS.length || 1);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filter = STATUS_FILTERS.find((option) => option.value === status);
    return MOCK_RENEWALS.filter((renewal) => {
      const current = statusOf(renewal.id, renewal.status);
      if (filter && current !== filter.status) return false;
      if (!term) return true;
      return (
        matches(renewal.policyNumber, term) ||
        matches(renewal.customerName, term) ||
        matches(renewal.agentName, term) ||
        matches(statusMeta(current).label, term)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status, overrides]);

  const shownDelta = filtered.reduce(
    (sum, row) => sum + (row.renewalPremium - row.currentPremium),
    0,
  );
  const hasFilters = query.trim().length > 0 || status !== 'all';

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
  };

  const handleRenew = (id: string) => {
    setOverrides((prev) => ({ ...prev, [id]: 'accepted' }));
  };

  const handleRemind = (id: string) => {
    setReminded((prev) => ({ ...prev, [id]: true }));
  };

  const cards = [
    {
      label: 'Renewal retention rate',
      value: formatPercent(stats.retentionRate, { digits: 1 }),
      hint: `${stats.retained} retained · ${stats.lapsed} lost · ${stats.open} in flight`,
    },
    {
      label: 'Book-wide retention',
      value: formatPercent(agentRetention, { digits: 1 }),
      hint: `Average across ${MOCK_AGENTS.length} agents · target 93.0%`,
    },
    {
      label: 'Due within 30 days',
      value: formatNumber(stats.dueSoon),
      hint: `${stats.total} renewals tracked this cycle`,
    },
    {
      label: 'Premium at renewal',
      value: formatCurrency(stats.renewalPremium, 'USD', { maximumFractionDigits: 0 }),
      hint: `${stats.delta >= 0 ? '+' : '−'}${formatCurrency(Math.abs(stats.delta), 'USD', { maximumFractionDigits: 0 })} vs current`,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Renewals</h1>
          <p className="mt-1 text-sm text-slate-500">
            Renewal book with countdowns, re-rating deltas and retention actions.
          </p>
        </div>
        <Badge variant="outline">
          {formatPercent(stats.retentionRate, { digits: 0 })} retention · {stats.open} in flight
        </Badge>
      </header>

      {/* ---------- Retention stats ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard key={card.label} label={card.label} value={card.value} hint={card.hint} />
        ))}
      </div>

      {/* ---------- Filters ---------- */}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label
              htmlFor="renewal-search"
              className="mb-1.5 block text-xs font-medium text-slate-500"
            >
              Search renewals
            </label>
            <input
              id="renewal-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Policy #, customer or agent…"
              className={inputClass + ' lg:max-w-md'}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStatus('all')}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition',
                status === 'all'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-700',
              )}
            >
              All statuses
            </button>
            {STATUS_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition',
                  status === option.value
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-700',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
            {stats.total} renewals ·{' '}
            <span className={shownDelta >= 0 ? 'font-semibold text-teal-600' : 'font-semibold text-rose-600'}>
              {shownDelta >= 0 ? '+' : '−'}
              {formatCurrency(Math.abs(shownDelta), 'USD', { maximumFractionDigits: 0 })}
            </span>{' '}
            premium change
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-medium text-teal-600 transition hover:text-teal-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* ---------- Renewal list ---------- */}
      <Card className="!p-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <CardTitle>Renewal queue</CardTitle>
          <Badge variant="secondary">Countdown · re-rate · retention</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1160px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Policy #</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Current vs new premium</th>
                <th className="px-3 py-3 font-medium">Renewal date</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Lapse risk</th>
                <th className="px-5 py-3 font-medium">Retention actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((renewal) => {
                const current = statusOf(renewal.id, renewal.status);
                const meta = statusMeta(current);
                const days = daysUntil(renewal.renewalDate);
                const tone = countdownTone(days);
                const delta = renewal.renewalPremium - renewal.currentPremium;
                const deltaPercent =
                  renewal.currentPremium > 0 ? delta / renewal.currentPremium : 0;
                const isRetained = current === 'accepted';
                const isClosed = isRetained || current === 'lapsed' || current === 'declined';

                return (
                  <tr
                    key={renewal.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-teal-50/40"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-semibold tabular-nums text-teal-700">
                        {renewal.policyNumber}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-400">
                        {renewal.agentName}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-slate-800">
                      {renewal.customerName}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-baseline gap-2">
                        <span className="tabular-nums text-slate-500 line-through decoration-slate-300">
                          {formatCurrency(renewal.currentPremium, 'USD', {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                        <span aria-hidden="true" className="text-slate-400">
                          →
                        </span>
                        <span className="font-semibold tabular-nums text-slate-800">
                          {formatCurrency(renewal.renewalPremium, 'USD', {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <span
                        className={cn(
                          'mt-0.5 block text-[11px] font-medium tabular-nums',
                          delta > 0 ? 'text-rose-600' : delta < 0 ? 'text-teal-600' : 'text-slate-400',
                        )}
                      >
                        {delta >= 0 ? '+' : '−'}
                        {formatCurrency(Math.abs(delta), 'USD', { maximumFractionDigits: 0 })} (
                        {deltaPercent >= 0 ? '+' : '−'}
                        {Math.abs(deltaPercent * 100).toFixed(1)}%)
                      </span>
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span className="text-slate-700">{formatDate(renewal.renewalDate)}</span>
                      <span
                        className={cn(
                          'mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold tabular-nums',
                          tone.className,
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} aria-hidden="true" />
                        {tone.text}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge variant={RISK_VARIANT[renewal.retentionRisk] ?? 'secondary'}>
                        {RISK_LABEL[renewal.retentionRisk] ?? renewal.retentionRisk}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isRetained}
                          onClick={() => handleRenew(renewal.id)}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                            isRetained
                              ? 'cursor-default bg-teal-50 text-teal-700'
                              : 'bg-teal-600 text-white hover:bg-teal-700',
                          )}
                        >
                          {isRetained ? 'Renewed ✓' : 'Renew'}
                        </button>
                        <button
                          type="button"
                          disabled={isClosed}
                          onClick={() => handleRemind(renewal.id)}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                            isClosed
                              ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                              : reminded[renewal.id]
                                ? 'bg-teal-50 text-teal-700'
                                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-700',
                          )}
                        >
                          {reminded[renewal.id] ? 'Reminder sent' : 'Remind'}
                        </button>
                      </div>
                      {!isClosed && renewal.reason ? (
                        <span className="mt-1 block max-w-[16rem] text-[11px] text-slate-400">
                          {renewal.reason}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <div className="border-t border-slate-100 px-5 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">No renewals match these filters</p>
            <p className="mt-1 text-xs text-slate-500">
              Try a different status, or clear the search.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
            >
              Reset filters
            </button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
