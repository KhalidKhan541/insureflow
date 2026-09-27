'use client';

import { useMemo, useState } from 'react';

import {
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
import { MOCK_COMMISSIONS } from '@/lib/mock-data';
import type { Commission } from '@/lib/mock-data';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

const TEAL = '#0d9488';
const TEAL_SOFT = '#5eead4';

const STATUS_FILTERS = ['All', 'Accrued', 'Paid', 'Held'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];
type DisplayStatus = Exclude<StatusFilter, 'All'>;

/**
 * Mock commission statuses are lowercase (`pending`, `paid`, …); this page works
 * with display labels, so normalize before comparing or rendering.
 */
function displayStatus(status: Commission['status']): DisplayStatus {
  if (status === 'paid') return 'Paid';
  if (status === 'pending' || status === 'approved') return 'Accrued';
  return 'Held';
}

const STATUS_TONES: Record<string, 'default' | 'success' | 'warning'> = {
  Accrued: 'default',
  Paid: 'success',
  Held: 'warning',
};

const STATUS_COLORS: Record<string, string> = {
  Accrued: TEAL,
  Paid: '#14b8a6',
  Held: '#f59e0b',
};

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

export default function CommissionsPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const totals = useMemo(() => {
    const acc = { gross: 0, earned: 0, paid: 0, accrued: 0, held: 0 };
    for (const row of MOCK_COMMISSIONS) {
      acc.gross += row.grossPremium;
      acc.earned += row.earned;
      const status = displayStatus(row.status);
      if (status === 'Paid') acc.paid += row.earned;
      else if (status === 'Accrued') acc.accrued += row.earned;
      else acc.held += row.earned;
    }
    return acc;
  }, []);

  const byPayee = useMemo(() => {
    const map = new Map<
      string,
      { payee: string; agency: string; payeeType: string; earned: number }
    >();
    for (const row of MOCK_COMMISSIONS) {
      const entry = map.get(row.payee) ?? {
        payee: row.payee,
        agency: row.agency,
        payeeType: row.payeeType,
        earned: 0,
      };
      entry.earned += row.earned;
      map.set(row.payee, entry);
    }
    return [...map.values()].sort((a, b) => b.earned - a.earned).slice(0, 8);
  }, []);

  const statusBreakdown = useMemo(
    () =>
      (['Accrued', 'Paid', 'Held'] as const).map((status) => {
        const rows = MOCK_COMMISSIONS.filter((row) => displayStatus(row.status) === status);
        return {
          status,
          count: rows.length,
          amount: rows.reduce((sum, row) => sum + row.earned, 0),
        };
      }),
    [],
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_COMMISSIONS.filter((row) => {
      if (statusFilter !== 'All' && displayStatus(row.status) !== statusFilter) return false;
      if (!q) return true;
      return [row.statement, row.payee, row.agency, row.payeeType, row.policyNumber, row.period]
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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Commissions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Agent and broker statements — gross premium, earned commission and payout status.
          </p>
        </div>
        <Badge variant="outline">Statement period · Sep 2026</Badge>
      </header>

      {/* ---------- Payout summary ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Gross premium booked"
          value={formatCurrency(totals.gross)}
          delta={7.3}
          deltaLabel="vs last period"
          hint={`${MOCK_COMMISSIONS.length} statements`}
          trend="up"
        />
        <MetricCard
          label="Commission earned"
          value={formatCurrency(totals.earned)}
          delta={6.5}
          deltaLabel="vs last period"
          hint={`${formatPercent(totals.earned / (totals.gross || 1), { digits: 1 })} blended rate`}
          trend="up"
        />
        <MetricCard
          label="Paid out"
          value={formatCurrency(totals.paid)}
          delta={4.2}
          deltaLabel="vs last period"
          hint={`${formatPercent(totals.paid / (totals.earned || 1), { digits: 0 })} of earned settled`}
          trend="up"
        />
        <MetricCard
          label="Unpaid balance"
          value={formatCurrency(totals.accrued + totals.held)}
          delta={-2.8}
          deltaLabel="vs last period"
          hint={`${formatCurrency(totals.accrued)} accrued · ${formatCurrency(totals.held)} held`}
          trend="down"
        />
      </div>

      {/* ---------- By-payee bars + status breakdown ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Commission by payee</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Top {byPayee.length} agents &amp; brokers by earned commission
              </p>
            </div>
            <Badge variant="secondary">YTD</Badge>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byPayee}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="payeeBar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.85} />
                    <stop offset="100%" stopColor={TEAL_SOFT} stopOpacity={0.95} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="payee"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#475569' }}
                  width={132}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar
                  dataKey="earned"
                  name="Earned commission"
                  fill="url(#payeeBar)"
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Payout status</CardTitle>
            <span className="text-xs text-slate-500">{formatCurrency(totals.earned)} earned</span>
          </div>
          <ul className="space-y-5">
            {statusBreakdown.map((row) => {
              const share = totals.earned > 0 ? row.amount / totals.earned : 0;
              return (
                <li key={row.status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: STATUS_COLORS[row.status] }}
                      />
                      {row.status}
                      <span className="text-xs font-normal text-slate-400">
                        {formatNumber(row.count)} stmt{row.count === 1 ? '' : 's'}
                      </span>
                    </span>
                    <span className="font-semibold tabular-nums text-slate-800">
                      {formatCurrency(row.amount)}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${share * 100}%`,
                        background: STATUS_COLORS[row.status],
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">{formatPercent(share, { digits: 0 })} of earned</p>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* ---------- Statement table ---------- */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Commission statements</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {filteredRows.length} of {MOCK_COMMISSIONS.length} statements
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search payee, policy, statement…"
              className={cn(inputClass, 'w-64')}
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className={selectClass}
              aria-label="Filter by payout status"
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
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 font-medium">Statement</th>
                <th className="px-3 py-2 font-medium">Payee</th>
                <th className="px-3 py-2 font-medium">Policy</th>
                <th className="px-3 py-2 text-right font-medium">Gross premium</th>
                <th className="px-3 py-2 text-right font-medium">Rate</th>
                <th className="px-3 py-2 text-right font-medium">Earned</th>
                <th className="px-3 py-2 font-medium">Period</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-sm text-slate-400">
                    No commission statements match your filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const status = displayStatus(row.status);
                  return (
                    <tr key={row.id} className="transition hover:bg-teal-50/40">
                      <td className="px-3 py-2.5 font-medium tabular-nums text-slate-800">
                        {row.statement}
                      </td>
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-slate-800">{row.payee}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {row.payeeType} · {row.agency}
                      </p>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-600">
                      {row.policyNumber}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                      {formatCurrency(row.grossPremium)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                      {formatPercent(row.rate, { digits: 1 })}
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-slate-800">
                      {formatCurrency(row.earned)}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">{row.period}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant={STATUS_TONES[status] ?? 'default'}>{status}</Badge>
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
