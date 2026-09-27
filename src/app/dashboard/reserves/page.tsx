'use client';

import { useMemo, useState } from 'react';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_RESERVES } from '@/lib/mock-data';
import type { Reserve } from '@/lib/mock-data';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

const TEAL = '#0d9488';

const MONTH_ORDER = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const TYPE_COLORS: Record<string, string> = {
  Case: TEAL,
  IBNR: '#2dd4bf',
  Salvage: '#99f6e4',
};

const STATUS_FILTERS = ['All', 'Open', 'Under Review', 'Closed'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const statusVariant: Record<string, 'default' | 'warning' | 'secondary'> = {
  Open: 'default',
  'Under Review': 'warning',
  Closed: 'secondary',
};

const adequacyVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  Adequate: 'success',
  Watch: 'warning',
  Deficient: 'destructive',
  Settled: 'secondary',
};

type Adequacy = keyof typeof adequacyVariant;

/**
 * Mock reserve statuses are lowercase (`under_review`, `released`, …); this page
 * works with display labels, so normalize before comparing or rendering.
 */
function displayStatus(status: Reserve['status']): StatusFilter {
  if (status === 'released') return 'Closed';
  if (status === 'under_review' || status === 'increase_requested') return 'Under Review';
  return 'Open';
}

function adequacyFor(row: (typeof MOCK_RESERVES)[number]): Adequacy {
  if (row.status === 'released') return 'Settled';
  const pool = row.paid + row.currentReserve;
  if (pool <= 0) return 'Deficient';
  const consumed = row.paid / pool;
  if (consumed >= 0.9) return 'Deficient';
  if (consumed >= 0.7) return 'Watch';
  return 'Adequate';
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

export default function ReservesPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const totals = useMemo(
    () =>
      MOCK_RESERVES.reduce(
        (acc, row) => ({
          initial: acc.initial + row.initialReserve,
          current: acc.current + row.currentReserve,
          paid: acc.paid + row.paid,
        }),
        { initial: 0, current: 0, paid: 0 },
      ),
    [],
  );

  const byType = useMemo(() => {
    const map = new Map<string, { name: string; value: number }>();
    for (const row of MOCK_RESERVES) {
      const entry = map.get(row.reserveType) ?? { name: row.reserveType, value: 0 };
      entry.value += row.currentReserve;
      map.set(row.reserveType, entry);
    }
    return [...map.values()].filter((entry) => entry.value > 0);
  }, []);

  /** Cumulative reserve position, built up as claims are opened. */
  const trend = useMemo(() => {
    const map = new Map<string, { month: string; reserves: number; initial: number }>();
    for (const row of MOCK_RESERVES) {
      const entry = map.get(row.opened) ?? { month: row.opened, reserves: 0, initial: 0 };
      entry.reserves += row.currentReserve;
      entry.initial += row.initialReserve;
      map.set(row.opened, entry);
    }
    let runningReserves = 0;
    let runningInitial = 0;
    return [...map.values()]
      .sort(
        (a, b) =>
          MONTH_ORDER.indexOf(a.month.slice(0, 3)) - MONTH_ORDER.indexOf(b.month.slice(0, 3)),
      )
      .map((entry) => {
        runningReserves += entry.reserves;
        runningInitial += entry.initial;
        return {
          month: entry.month,
          reserves: runningReserves,
          initial: runningInitial,
        };
      });
  }, []);

  const riskCount = MOCK_RESERVES.filter((row) => adequacyFor(row) === 'Deficient').length;
  const reviewCount = MOCK_RESERVES.filter((row) => adequacyFor(row) === 'Watch').length;

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_RESERVES.filter((row) => {
      if (statusFilter !== 'All' && displayStatus(row.status) !== statusFilter) return false;
      if (!q) return true;
      return [row.claimNumber, row.claimant, row.policyNumber, row.adjuster, row.reserveType]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [query, statusFilter]);

  const selectClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20';
  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

  const tableHead =
    'border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500';

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reserves</h1>
          <p className="mt-1 text-sm text-slate-500">
            Case, IBNR and salvage reserve positions with adequacy monitoring by adjuster.
          </p>
        </div>
        <Badge variant="outline">Valuation date · Sep 26, 2026</Badge>
      </header>

      {/* ---------- KPI row ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total reserves"
          value={formatCurrency(totals.current)}
          delta={-2.4}
          deltaLabel="vs last valuation"
          hint={`${MOCK_RESERVES.length} reserve records`}
          trend="down"
        />
        <MetricCard
          label="Initial reserves"
          value={formatCurrency(totals.initial)}
          delta={0.8}
          deltaLabel="since inception"
          hint="At first establishment"
          trend="up"
        />
        <MetricCard
          label="Paid to date"
          value={formatCurrency(totals.paid)}
          delta={4.1}
          deltaLabel="vs last month"
          hint={`${formatPercent(totals.paid / (totals.initial || 1), { digits: 0 })} of initial set aside`}
          trend="up"
        />
        <MetricCard
          label="Adequacy flags"
          value={formatNumber(riskCount + reviewCount)}
          delta={-1.0}
          deltaLabel="vs last review"
          hint={`${riskCount} deficient · ${reviewCount} watch`}
          trend="down"
        />
      </div>

      {/* ---------- Donut + trend ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Total reserves by type</CardTitle>
            <span className="text-xs text-slate-500">{formatCurrency(totals.current)}</span>
          </div>
          <div className="relative h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byType}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={64}
                  outerRadius={92}
                  paddingAngle={2}
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {byType.map((entry) => (
                    <Cell key={entry.name} fill={TYPE_COLORS[entry.name] ?? TEAL} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-lg font-semibold tabular-nums text-slate-900">
                {formatCurrency(totals.current, 'USD', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                })}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Reserved</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {byType.map((entry) => (
              <li key={entry.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: TYPE_COLORS[entry.name] ?? TEAL }}
                  />
                  {entry.name}
                </span>
                <span className="font-semibold tabular-nums text-slate-800">
                  {formatCurrency(entry.value)}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Reserve trend</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Cumulative current vs initial reserve position by open month
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL }} />
                Current reserve
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: '#5eead4' }}
                />
                Initial reserve
              </span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="reserveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="initialFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5eead4" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#5eead4" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => String(v).slice(0, 3)}
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
                  dataKey="initial"
                  name="Initial reserve"
                  stroke="#5eead4"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  fill="url(#initialFill)"
                />
                <Area
                  type="monotone"
                  dataKey="reserves"
                  name="Current reserve"
                  stroke={TEAL}
                  strokeWidth={2}
                  fill="url(#reserveFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ---------- Reserve table ---------- */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Reserve ledger</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {filteredRows.length} of {MOCK_RESERVES.length} reserves · {riskCount} deficient ·{' '}
              {reviewCount} on watch
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search claim, adjuster, policy…"
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
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className={tableHead}>
                <th className="px-3 py-2 font-medium">Claim #</th>
                <th className="px-3 py-2 font-medium">Reserve type</th>
                <th className="px-3 py-2 text-right font-medium">Initial</th>
                <th className="px-3 py-2 text-right font-medium">Current</th>
                <th className="px-3 py-2 text-right font-medium">Change</th>
                <th className="px-3 py-2 font-medium">Adequacy</th>
                <th className="px-3 py-2 font-medium">Adjuster</th>
                <th className="px-3 py-2 font-medium">Last review</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-10 text-center text-sm text-slate-400">
                    No reserves match your filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const change =
                    row.initialReserve > 0
                      ? ((row.currentReserve - row.initialReserve) / row.initialReserve) * 100
                      : 0;
                  const adequacy = adequacyFor(row);
                  const status = displayStatus(row.status);
                  return (
                    <tr key={row.id} className="transition hover:bg-teal-50/40">
                      <td className="px-3 py-2.5">
                        <p className="font-medium tabular-nums text-slate-800">
                          {row.claimNumber}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {row.claimant} · {row.policyNumber}
                        </p>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge
                          variant="outline"
                          className={
                            row.reserveType === 'Case'
                              ? 'text-teal-700 ring-teal-600/30'
                              : undefined
                          }
                        >
                          {row.reserveType}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                        {formatCurrency(row.initialReserve)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-slate-800">
                        {formatCurrency(row.currentReserve)}
                      </td>
                      <td
                        className={cn(
                          'px-3 py-2.5 text-right tabular-nums',
                          change > 0 ? 'text-teal-600' : change < 0 ? 'text-rose-500' : 'text-slate-400',
                        )}
                      >
                        {change > 0 ? '+' : ''}
                        {change.toFixed(1)}%
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={adequacyVariant[adequacy]}>{adequacy}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{row.adjuster}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">
                        {row.lastReview}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={statusVariant[status] ?? 'secondary'}>{status}</Badge>
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
