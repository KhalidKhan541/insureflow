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
import { cn, formatCurrency, formatPercent } from '@/lib/utils';

const TEAL = '#0d9488';
const TEAL_SOFT = '#5eead4';

/** Fixed reference date keeps the aging buckets deterministic in this demo. */
const TODAY = new Date('2026-09-26T00:00:00');
const DAY_MS = 86_400_000;

const STATUS_FILTERS = ['All', 'Collected', 'Partial', 'Outstanding', 'Overdue'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const AGING_BUCKETS = ['Current', '1–30 days', '31–60 days', '61–90 days', '90+ days'] as const;
type AgingBucket = (typeof AGING_BUCKETS)[number];

const statusVariant: Record<string, 'success' | 'default' | 'warning' | 'destructive'> = {
  Collected: 'success',
  Partial: 'default',
  Outstanding: 'warning',
  Overdue: 'destructive',
};

function daysPastDue(dueDate: string): number {
  return Math.floor((TODAY.getTime() - new Date(dueDate).getTime()) / DAY_MS);
}

function bucketFor(days: number): AgingBucket {
  if (days <= 0) return 'Current';
  if (days <= 30) return '1–30 days';
  if (days <= 60) return '31–60 days';
  if (days <= 90) return '61–90 days';
  return '90+ days';
}

function monthLabel(period: string): string {
  return period.slice(0, 3);
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

  const totals = useMemo(
    () =>
      MOCK_PREMIUMS.reduce(
        (acc, row) => ({
          written: acc.written + row.written,
          earned: acc.earned + row.earned,
          collected: acc.collected + row.collected,
          outstanding: acc.outstanding + row.outstanding,
        }),
        { written: 0, earned: 0, collected: 0, outstanding: 0 },
      ),
    [],
  );

  const collectionRate = totals.written > 0 ? totals.collected / totals.written : 0;

  const trend = useMemo(() => {
    const byPeriod = new Map<
      string,
      { period: string; written: number; earned: number; collected: number }
    >();
    for (const row of MOCK_PREMIUMS) {
      const entry = byPeriod.get(row.period) ?? {
        period: row.period,
        written: 0,
        earned: 0,
        collected: 0,
      };
      entry.written += row.written;
      entry.earned += row.earned;
      entry.collected += row.collected;
      byPeriod.set(row.period, entry);
    }
    return [...byPeriod.values()];
  }, []);

  const byProduct = useMemo(() => {
    const map = new Map<string, { product: string; written: number; collected: number }>();
    for (const row of MOCK_PREMIUMS) {
      const entry = map.get(row.product) ?? { product: row.product, written: 0, collected: 0 };
      entry.written += row.written;
      entry.collected += row.collected;
      map.set(row.product, entry);
    }
    return [...map.values()].sort((a, b) => b.written - a.written);
  }, []);

  const aging = useMemo(() => {
    const buckets = new Map<AgingBucket, { bucket: AgingBucket; invoices: number; amount: number }>(
      AGING_BUCKETS.map((bucket) => [bucket, { bucket, invoices: 0, amount: 0 }]),
    );
    for (const row of MOCK_PREMIUMS) {
      if (row.outstanding <= 0) continue;
      const entry = buckets.get(bucketFor(daysPastDue(row.dueDate)))!;
      entry.invoices += 1;
      entry.amount += row.outstanding;
    }
    return AGING_BUCKETS.map((bucket) => buckets.get(bucket)!);
  }, []);

  const overdueCount = MOCK_PREMIUMS.filter(
    (row) => row.outstanding > 0 && daysPastDue(row.dueDate) > 0,
  ).length;

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PREMIUMS.filter((row) => {
      if (statusFilter !== 'All' && row.status !== statusFilter) return false;
      if (!q) return true;
      return [row.policyNumber, row.customer, row.product, row.period, row.status]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [query, statusFilter]);

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
            Written vs earned premium, product mix, collection rate and outstanding aging.
          </p>
        </div>
        <Badge variant="outline">Jan–Sep 2026 · Accrual basis</Badge>
      </header>

      {/* ---------- KPI row ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Written premium"
          value={formatCurrency(totals.written)}
          delta={8.6}
          deltaLabel="vs prior period"
          hint={`${trend.length} billing periods`}
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
          hint={`${overdueCount} invoices past due`}
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
              <dt className="text-slate-500">Past due invoices</dt>
              <dd className="font-semibold tabular-nums text-rose-600">{overdueCount}</dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* ---------- By-product bars + aging ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Premium by product</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Written vs collected, all periods</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL }} />
                Written
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL_SOFT }} />
                Collected
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byProduct} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="product"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  width={44}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="written" name="Written" fill={TEAL} radius={[4, 4, 0, 0]} maxBarSize={26} />
                <Bar
                  dataKey="collected"
                  name="Collected"
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
            <CardTitle>Outstanding aging</CardTitle>
            <span className="text-xs text-slate-500">
              {formatCurrency(totals.outstanding)} open
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="pb-2 font-medium">Bucket</th>
                <th className="pb-2 text-right font-medium">Inv.</th>
                <th className="pb-2 text-right font-medium">Outstanding</th>
                <th className="pb-2 text-right font-medium">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {aging.map((row) => {
                const share = totals.outstanding > 0 ? row.amount / totals.outstanding : 0;
                const stale = row.bucket !== 'Current' && row.amount > 0;
                return (
                  <tr key={row.bucket} className="hover:bg-teal-50/40">
                    <td className="py-2.5">
                      <span
                        className={cn(
                          'text-xs font-medium',
                          stale ? 'text-rose-600' : 'text-slate-600',
                        )}
                      >
                        {row.bucket}
                      </span>
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-500">
                      {row.invoices}
                    </td>
                    <td className="py-2.5 text-right font-semibold tabular-nums text-slate-800">
                      {formatCurrency(row.amount)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-500">
                      {formatPercent(share, { digits: 0 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ---------- Monthly detail ---------- */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Monthly premium detail</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {filteredRows.length} of {MOCK_PREMIUMS.length} ledger entries
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search policy, customer, product…"
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
                <th className="px-3 py-2 font-medium">Period</th>
                <th className="px-3 py-2 font-medium">Policy</th>
                <th className="px-3 py-2 font-medium">Customer</th>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 text-right font-medium">Written</th>
                <th className="px-3 py-2 text-right font-medium">Earned</th>
                <th className="px-3 py-2 text-right font-medium">Collected</th>
                <th className="px-3 py-2 text-right font-medium">Outstanding</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-10 text-center text-sm text-slate-400"
                  >
                    No premium entries match your search.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-teal-50/40">
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">{row.period}</td>
                    <td className="px-3 py-2.5 font-medium tabular-nums text-slate-800">
                      {row.policyNumber}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{row.customer}</td>
                    <td className="px-3 py-2.5 text-slate-600">{row.product}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                      {formatCurrency(row.written)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                      {formatCurrency(row.earned)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium tabular-nums text-slate-800">
                      {formatCurrency(row.collected)}
                    </td>
                    <td
                      className={cn(
                        'px-3 py-2.5 text-right tabular-nums',
                        row.outstanding > 0 ? 'font-medium text-amber-600' : 'text-slate-400',
                      )}
                    >
                      {formatCurrency(row.outstanding)}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant={statusVariant[row.status] ?? 'default'}>{row.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
