'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_PAYMENTS } from '@/lib/mock-data';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';

const TEAL = '#0d9488';

/** Fixed reference date keeps the aging buckets deterministic in this demo. */
const TODAY = new Date('2026-09-26T00:00:00');
const DAY_MS = 86_400_000;

const STATUS_FILTERS = ['All', 'Paid', 'Pending', 'Failed', 'Refunded'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const METHOD_FILTERS = ['All', 'Card', 'ACH', 'Check', 'Wire'] as const;
type MethodFilter = (typeof METHOD_FILTERS)[number];

const AGING_BUCKETS = ['Not yet due', '1–30 days', '31–60 days', '60+ days'] as const;

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  Paid: 'success',
  Pending: 'warning',
  Failed: 'destructive',
  Refunded: 'secondary',
};

const methodBadge: Record<string, 'default' | 'secondary' | 'outline'> = {
  Card: 'default',
  ACH: 'secondary',
  Check: 'outline',
  Wire: 'outline',
};

const STATUS_COLORS: Record<string, string> = {
  Paid: TEAL,
  Pending: '#5eead4',
  Failed: '#f43f5e',
  Refunded: '#94a3b8',
};

const STATUS_MIX = ['Paid', 'Pending', 'Failed', 'Refunded'] as const;

function daysPastDue(dueDate: string): number {
  return Math.floor((TODAY.getTime() - new Date(dueDate).getTime()) / DAY_MS);
}

function bucketFor(days: number): (typeof AGING_BUCKETS)[number] {
  if (days <= 0) return 'Not yet due';
  if (days <= 30) return '1–30 days';
  if (days <= 60) return '31–60 days';
  return '60+ days';
}

function shortDate(value: string | null): string {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ChartTooltip({ active, payload, label }: any) {
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
          {entry.name ?? entry.dataKey}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function PaymentsPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('All');

  const totals = useMemo(() => {
    const acc = { paid: 0, pending: 0, failed: 0, refunded: 0, collected: 0, billed: 0 };
    for (const row of MOCK_PAYMENTS) {
      acc.billed += row.amount;
      if (row.status === 'Paid') {
        acc.paid += row.amount;
        acc.collected += row.amount;
      } else if (row.status === 'Pending') {
        acc.pending += row.amount;
      } else if (row.status === 'Failed') {
        acc.failed += row.amount;
      } else {
        acc.refunded += row.amount;
        acc.collected -= row.amount;
      }
    }
    return acc;
  }, []);

  const statusMix = useMemo(
    () =>
      STATUS_MIX.map((status) => ({
        name: status,
        value: MOCK_PAYMENTS.filter((row) => row.status === status).reduce(
          (sum, row) => sum + row.amount,
          0,
      ),
      })).filter((entry) => entry.value > 0),
    [],
  );

  const aging = useMemo(() => {
    const buckets = new Map<string, { bucket: string; count: number; amount: number }>(
      AGING_BUCKETS.map((bucket) => [bucket, { bucket, count: 0, amount: 0 }]),
    );
    for (const row of MOCK_PAYMENTS) {
      if (row.status === 'Paid' || row.status === 'Refunded') continue;
      const entry = buckets.get(bucketFor(daysPastDue(row.dueDate)))!;
      entry.count += 1;
      entry.amount += row.amount;
    }
    const rows = AGING_BUCKETS.map((bucket) => buckets.get(bucket)!);
    const maxAmount = Math.max(...rows.map((row) => row.amount), 1);
    return { rows, maxAmount };
  }, []);

  const openTotal = aging.rows.reduce((sum, row) => sum + row.amount, 0);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PAYMENTS.filter((row) => {
      if (statusFilter !== 'All' && row.status !== statusFilter) return false;
      if (methodFilter !== 'All' && row.method !== methodFilter) return false;
      if (!q) return true;
      return [
        row.reference,
        row.policyNumber,
        row.customer,
        row.method,
        row.status,
        String(row.installment),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [query, statusFilter, methodFilter]);

  const selectClass =
    'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20';
  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Payments</h1>
          <p className="mt-1 text-sm text-slate-500">
            Installment receipts across card, ACH, check and wire — with due-vs-paid tracking.
          </p>
        </div>
        <Badge variant="outline">{MOCK_PAYMENTS.length} transactions · Sep 2026 cycle</Badge>
      </header>

      {/* ---------- KPI row ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Collected"
          value={formatCurrency(totals.paid)}
          delta={5.8}
          deltaLabel="vs last cycle"
          hint={`${formatPercent(totals.paid / (totals.billed || 1), { digits: 0 })} of billed volume`}
          trend="up"
        />
        <MetricCard
          label="Pending"
          value={formatCurrency(totals.pending)}
          delta={2.1}
          deltaLabel="vs last cycle"
          hint="Awaiting settlement"
          trend="up"
        />
        <MetricCard
          label="Failed"
          value={formatCurrency(totals.failed)}
          delta={-1.6}
          deltaLabel="vs last cycle"
          hint="Retries scheduled"
          trend="down"
        />
        <MetricCard
          label="Refunded"
          value={formatCurrency(totals.refunded)}
          delta={0.4}
          deltaLabel="vs last cycle"
          hint="Reversed transactions"
          trend="flat"
        />
      </div>

      {/* ---------- Status mix + aging ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Status mix</CardTitle>
            <span className="text-xs text-slate-500">{formatCurrency(totals.billed)} billed</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={2}
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {statusMix.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? TEAL} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-2">
            {statusMix.map((entry) => (
              <li key={entry.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: STATUS_COLORS[entry.name] ?? TEAL }}
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
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Aging summary</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Unsettled payments bucketed by days past the due date
              </p>
            </div>
            <Badge variant="warning">{formatCurrency(openTotal)} open</Badge>
          </div>
          <ul className="space-y-4">
            {aging.rows.map((row) => {
              const share = openTotal > 0 ? row.amount / openTotal : 0;
              const pastDue = row.bucket !== 'Not yet due' && row.amount > 0;
              return (
                <li key={row.bucket}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {row.bucket}
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        {row.count} payment{row.count === 1 ? '' : 's'}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{formatPercent(share, { digits: 0 })} of open</span>
                      <span
                        className={cn(
                          'font-semibold tabular-nums',
                          pastDue ? 'text-rose-600' : 'text-slate-800',
                        )}
                      >
                        {formatCurrency(row.amount)}
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(row.amount / aging.maxAmount) * 100}%`,
                        background: pastDue
                          ? 'linear-gradient(90deg, #f43f5e 0%, #fda4af 100%)'
                          : `linear-gradient(90deg, ${TEAL} 0%, #5eead4 100%)`,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* ---------- Payment list ---------- */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Payment list</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {filteredRows.length} of {MOCK_PAYMENTS.length} transactions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search policy, customer, reference…"
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
            <select
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value as MethodFilter)}
              className={selectClass}
              aria-label="Filter by method"
            >
              {METHOD_FILTERS.map((method) => (
                <option key={method} value={method}>
                  {method === 'All' ? 'All methods' : method}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 font-medium">Reference</th>
                <th className="px-3 py-2 font-medium">Policy</th>
                <th className="px-3 py-2 font-medium">Customer</th>
                <th className="px-3 py-2 text-right font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Method</th>
                <th className="px-3 py-2 font-medium">Installment</th>
                <th className="px-3 py-2 font-medium">Due date</th>
                <th className="px-3 py-2 font-medium">Paid date</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-10 text-center text-sm text-slate-400">
                    No payments match your filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const late =
                    row.status === 'Paid' &&
                    row.paidDate !== null &&
                    new Date(row.paidDate).getTime() > new Date(row.dueDate).getTime();
                  return (
                    <tr key={row.id} className="transition hover:bg-teal-50/40">
                      <td className="px-3 py-2.5 font-medium tabular-nums text-slate-800">
                        {row.reference}
                      </td>
                      <td className="px-3 py-2.5">
                        <Link
                          href={`/dashboard/policies?policy=${row.policyNumber}`}
                          className="font-medium tabular-nums text-teal-600 underline-offset-2 hover:underline"
                        >
                          {row.policyNumber}
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{row.customer}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-slate-800">
                        {formatCurrency(row.amount)}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={methodBadge[row.method] ?? 'outline'}>{row.method}</Badge>
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-slate-600">
                        {row.installment} of {row.installments}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">
                        {shortDate(row.dueDate)}
                      </td>
                      <td
                        className={cn(
                          'px-3 py-2.5 whitespace-nowrap',
                          late ? 'font-medium text-amber-600' : 'text-slate-600',
                        )}
                      >
                        {shortDate(row.paidDate)}
                        {late ? <span className="ml-1 text-[11px]">late</span> : null}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={statusVariant[row.status] ?? 'default'}>{row.status}</Badge>
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
