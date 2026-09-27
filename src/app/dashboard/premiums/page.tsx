'use client';

import { useMemo, useState } from 'react';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_PREMIUMS } from '@/lib/mock-data';
import type { PremiumMonth } from '@/lib/mock-data';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

const TEAL = '#0d9488';
const TEAL_SOFT = '#5eead4';

/** Collection rate a closed month is expected to reach before it counts as collected. */
const COLLECTION_TARGET = 0.925;
/** Anything below this is treated as still outstanding rather than merely partial. */
const OUTSTANDING_FLOOR = 0.8;

const STATUS_FILTERS = ['All', 'Collected', 'Partial', 'Outstanding'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];
type MonthStatus = Exclude<StatusFilter, 'All'>;

const statusVariant: Record<MonthStatus, 'success' | 'warning' | 'destructive'> = {
  Collected: 'success',
  Partial: 'warning',
  Outstanding: 'destructive',
};

/** The ledger has no per-invoice due dates — derive a month status from collection rate. */
function statusFor(row: PremiumMonth): MonthStatus {
  const rate = row.writtenPremium > 0 ? row.premiumCollected / row.writtenPremium : 0;
  if (rate >= COLLECTION_TARGET) return 'Collected';
  if (rate >= OUTSTANDING_FLOOR) return 'Partial';
  return 'Outstanding';
}

function monthLabel(label: string): string {
  return label.slice(0, 3);
}

function average(rows: PremiumMonth[], pick: (row: PremiumMonth) => number): number {
  if (rows.length === 0) return 0;
  return rows.reduce((sum, row) => sum + pick(row), 0) / rows.length;
}

function ChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-semibold text-slate-500">{label ?? payload[0]?.name}</p>
      {payload.map((entry: any) => (
        <p
          key={entry.dataKey ?? entry.name}
          className="text-xs font-medium"
          style={{ color: entry.color ?? entry.fill }}
        >
          {entry.name ?? entry.dataKey}:{' '}
          {formatter ? formatter(entry.value) : formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function PremiumsPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  /** One row per month, sorted chronologically (YYYY-MM sorts naturally). */
  const months = useMemo(() => [...MOCK_PREMIUMS].sort((a, b) => a.month.localeCompare(b.month)), []);

  const totals = useMemo(
    () =>
      months.reduce(
        (acc, row) => ({
          written: acc.written + row.writtenPremium,
          earned: acc.earned + row.earnedPremium,
          collected: acc.collected + row.premiumCollected,
          outstanding: acc.outstanding + row.premiumOutstanding,
        }),
        { written: 0, earned: 0, collected: 0, outstanding: 0 },
      ),
    [months],
  );

  const collectionRate = totals.written > 0 ? totals.collected / totals.written : 0;

  const trend = useMemo(
    () =>
      months.map((row) => ({
        period: row.label,
        written: row.writtenPremium,
        earned: row.earnedPremium,
        collected: row.premiumCollected,
      })),
    [months],
  );

  /** The ledger has no product dimension — split written premium by business type instead. */
  const byMonth = useMemo(
    () =>
      months.map((row) => ({
        period: row.label,
        newBusiness: row.newBusinessPremium,
        renewal: row.renewalPremium,
      })),
    [months],
  );

  const ratios = useMemo(
    () => ({
      loss: average(months, (row) => row.lossRatio),
      expense: average(months, (row) => row.expenseRatio),
      combined: average(months, (row) => row.combinedRatio),
    }),
    [months],
  );

  const laggingCount = months.filter((row) => statusFor(row) !== 'Collected').length;

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return months.filter((row) => {
      const status = statusFor(row);
      if (statusFilter !== 'All' && status !== statusFilter) return false;
      if (!q) return true;
      return [row.label, row.month, status].join(' ').toLowerCase().includes(q);
    });
  }, [months, query, statusFilter]);

  const periodRange =
    months.length > 0 ? `${months[0].label} – ${months[months.length - 1].label}` : '';

  const selectClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20';
  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Premium ledger</h1>
          <p className="mt-1 text-sm text-slate-500">
            Written vs earned premium, collection rate, business mix and monthly close status.
          </p>
        </div>
        <Badge variant="outline">{periodRange} · Accrual basis</Badge>
      </header>

      {/* ---------- KPI row ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Written premium"
          value={formatCurrency(totals.written)}
          delta={8.6}
          deltaLabel="vs prior period"
          hint={`${trend.length} billing months`}
          trend="up"
        />
        <MetricCard
          label="Earned premium"
          value={formatCurrency(totals.earned)}
          delta={6.2}
          deltaLabel="vs prior period"
          hint={`${formatPercent(totals.earned / (totals.written || 1), { digits: 0 })} of written earned`}
          trend="up"
        />
        <MetricCard
          label="Collection rate"
          value={formatPercent(collectionRate, { digits: 1 })}
          delta={1.4}
          deltaLabel="pts vs last month"
          hint={`${formatCurrency(totals.collected)} collected`}
          trend="up"
        />
        <MetricCard
          label="Outstanding premium"
          value={formatCurrency(totals.outstanding)}
          delta={-3.2}
          deltaLabel="vs last month"
          hint={`${laggingCount} month${laggingCount === 1 ? '' : 's'} below collection target`}
          trend="down"
        />
      </div>

      {/* ---------- Trend + collection rate ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Written vs earned premium</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                {formatCurrency(totals.written)} written · {formatCurrency(totals.earned)} earned
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL }} />
                Written
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL_SOFT }} />
                Earned
              </span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="writtenFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="earnedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL_SOFT} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={TEAL_SOFT} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={monthLabel}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  width={44}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#cbd5e1' }} />
                <Area
                  type="monotone"
                  dataKey="written"
                  name="Written"
                  stroke={TEAL}
                  strokeWidth={2}
                  fill="url(#writtenFill)"
                />
                <Area
                  type="monotone"
                  dataKey="earned"
                  name="Earned"
                  stroke={TEAL_SOFT}
                  strokeWidth={2}
                  fill="url(#earnedFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Collection rate</CardTitle>
            <Badge variant={collectionRate >= 0.9 ? 'success' : 'warning'}>
              {formatPercent(collectionRate, { digits: 1 })}
            </Badge>
          </div>
          <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
            {formatPercent(collectionRate, { digits: 1 })}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {formatCurrency(totals.collected)} of {formatCurrency(totals.written)} billed premium
            received
          </p>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(collectionRate * 100, 100)}%`,
                background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_SOFT} 100%)`,
              }}
            />
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Collected</dt>
              <dd className="font-semibold tabular-nums text-slate-800">
                {formatCurrency(totals.collected)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Outstanding</dt>
              <dd className="font-semibold tabular-nums text-amber-600">
                {formatCurrency(totals.outstanding)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Months below target</dt>
              <dd className="font-semibold tabular-nums text-rose-600">{laggingCount}</dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* ---------- Business mix + ratios ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>New business vs renewal</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Written premium split by month, all billing periods
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL }} />
                New business
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL_SOFT }} />
                Renewal
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMonth} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={monthLabel}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  width={44}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar
                  dataKey="newBusiness"
                  name="New business"
                  fill={TEAL}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={26}
                />
                <Bar
                  dataKey="renewal"
                  name="Renewal"
                  fill={TEAL_SOFT}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Underwriting ratios</CardTitle>
            <Badge variant={ratios.combined < 1 ? 'success' : 'danger'}>
              {formatPercent(ratios.combined, { digits: 1 })} combined
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Period-to-date averages across {months.length} closed months
          </p>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Loss ratio</dt>
              <dd className="flex items-center gap-2">
                <span className="font-semibold tabular-nums text-slate-800">
                  {formatPercent(ratios.loss, { digits: 1 })}
                </span>
                <Badge variant={ratios.loss <= 0.65 ? 'success' : 'warning'}>
                  {ratios.loss <= 0.65 ? 'Healthy' : 'Watch'}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Expense ratio</dt>
              <dd className="font-semibold tabular-nums text-slate-800">
                {formatPercent(ratios.expense, { digits: 1 })}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Combined ratio</dt>
              <dd className="flex items-center gap-2">
                <span className="font-semibold tabular-nums text-slate-800">
                  {formatPercent(ratios.combined, { digits: 1 })}
                </span>
                <Badge variant={ratios.combined < 1 ? 'success' : 'danger'}>
                  {ratios.combined < 1 ? 'Profitable' : 'Loss-making'}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Policies issued</dt>
              <dd className="font-semibold tabular-nums text-slate-800">
                {formatNumber(months.reduce((sum, row) => sum + row.policiesIssued, 0))}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* ---------- Monthly detail ---------- */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Monthly premium detail</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {filteredRows.length} of {months.length} ledger entries
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search month or status…"
              className={cn(inputClass, 'w-64')}
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className={selectClass}
              aria-label="Filter by status"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All statuses' : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 font-medium">Month</th>
                <th className="px-3 py-2 text-right font-medium">Written</th>
                <th className="px-3 py-2 text-right font-medium">Earned</th>
                <th className="px-3 py-2 text-right font-medium">Collected</th>
                <th className="px-3 py-2 text-right font-medium">Outstanding</th>
                <th className="px-3 py-2 text-right font-medium">Loss ratio</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-slate-400">
                    No premium entries match your search.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const status = statusFor(row);
                  return (
                    <tr key={row.id} className="transition hover:bg-teal-50/40">
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="font-medium text-slate-800">{row.label}</span>
                        <span className="ml-2 text-xs text-slate-400">
                          {formatNumber(row.policiesIssued)} policies
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                        {formatCurrency(row.writtenPremium)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                        {formatCurrency(row.earnedPremium)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium tabular-nums text-slate-800">
                        {formatCurrency(row.premiumCollected)}
                      </td>
                      <td
                        className={cn(
                          'px-3 py-2.5 text-right tabular-nums',
                          row.premiumOutstanding > 0
                            ? 'font-medium text-amber-600'
                            : 'text-slate-400',
                        )}
                      >
                        {formatCurrency(row.premiumOutstanding)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                        {formatPercent(row.lossRatio, { digits: 1 })}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={statusVariant[status]}>{status}</Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
