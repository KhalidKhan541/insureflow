'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import {
  MOCK_ACTIVITY_FEED,
  MOCK_DASHBOARD_METRICS,
  MOCK_OPEN_CLAIMS,
  MOCK_POLICY_STATUS,
  MOCK_PREMIUM_CLAIMS,
  MOCK_TOP_AGENTS,
} from '@/lib/mock-data';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

const TEAL = '#0d9488';
const TEAL_SOFT = '#5eead4';

const severityVariant: Record<string, 'destructive' | 'warning' | 'default' | 'success'> = {
  Critical: 'destructive',
  High: 'warning',
  Medium: 'default',
  Low: 'success',
};

const statusTone: Record<string, string> = {
  Active: 'text-teal-600',
  'Pending Renewal': 'text-amber-600',
  'In Underwriting': 'text-sky-600',
  Lapsed: 'text-rose-600',
  'Endorsement Review': 'text-violet-600',
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="text-xs font-medium" style={{ color: entry.color }}>
          {entry.dataKey === 'premium' ? 'Written premium' : 'Claims paid'}:{' '}
          {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const maxBook = Math.max(...MOCK_TOP_AGENTS.map((agent) => agent.book));
  const activePolicies = MOCK_POLICY_STATUS.reduce((sum, s) => sum + s.count, 0);
  const premiumToDate = MOCK_PREMIUM_CLAIMS.reduce((sum, m) => sum + m.premium, 0);
  const claimsPaidToDate = MOCK_PREMIUM_CLAIMS.reduce((sum, m) => sum + m.claims, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Book performance, claims exposure and agency activity at a glance.
          </p>
        </div>
        <Badge variant="outline">Rolling 9 months · Updated 2 min ago</Badge>
      </header>

      {/* ---------- KPI row ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MOCK_DASHBOARD_METRICS.map((metric) => (
          <MetricCard
            key={metric.key}
            label={metric.label}
            value={
              metric.format === 'currency'
                ? formatCurrency(metric.value)
                : metric.format === 'percent'
                  ? formatPercent(metric.value)
                  : formatNumber(metric.value)
            }
            delta={metric.delta}
            deltaLabel={metric.deltaLabel}
            hint={metric.hint}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* ---------- Premium vs claims + open claims ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Premium vs claims paid</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                {formatCurrency(premiumToDate)} written · {formatCurrency(claimsPaidToDate)} paid
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL }} />
                Written premium
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL_SOFT }} />
                Claims paid
              </span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_PREMIUM_CLAIMS} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="premiumFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="claimsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL_SOFT} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={TEAL_SOFT} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="month"
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
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="premium"
                  stroke={TEAL}
                  strokeWidth={2}
                  fill="url(#premiumFill)"
                />
                <Area
                  type="monotone"
                  dataKey="claims"
                  stroke={TEAL_SOFT}
                  strokeWidth={2}
                  fill="url(#claimsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Open claims feed</CardTitle>
            <Badge variant="secondary">{MOCK_OPEN_CLAIMS.length} open</Badge>
          </div>
          <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {MOCK_OPEN_CLAIMS.map((claim) => (
              <li
                key={claim.id}
                className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3 transition hover:border-teal-300 hover:bg-teal-50/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {claim.claimant}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {claim.claimNumber} · {claim.type}
                    </p>
                  </div>
                  <Badge variant={severityVariant[claim.severity] ?? 'default'}>
                    {claim.severity}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(claim.amount)}
                  </span>
                  <span className="text-slate-500">{claim.filed}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ---------- Top agents + policy status ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Top agents by book of business</CardTitle>
            <Badge variant="outline">YTD</Badge>
          </div>
          <ul className="space-y-4">
            {MOCK_TOP_AGENTS.map((agent, index) => (
              <li key={agent.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal-700">
                      {index + 1}
                    </span>
                    {agent.name}
                    <span className="text-xs font-normal text-slate-400">{agent.agency}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {agent.policies} policies · {formatPercent(agent.retention, 0)} retained
                    </span>
                    <span className="font-semibold tabular-nums text-slate-800">
                      {formatCurrency(agent.book)}
                    </span>
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(agent.book / maxBook) * 100}%`,
                      background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_SOFT} 100%)`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Policy status</CardTitle>
              <span className="text-xs text-slate-500">
                {formatNumber(activePolicies)} policies
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_POLICY_STATUS.map((status) => (
                <div
                  key={status.label}
                  className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3"
                >
                  <p className={`text-lg font-semibold tabular-nums ${statusTone[status.label] ?? 'text-slate-800'}`}>
                    {formatNumber(status.count)}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">{status.label}</p>
                  <p
                    className={`mt-1 text-[11px] font-medium ${
                      status.delta >= 0 ? 'text-teal-600' : 'text-rose-500'
                    }`}
                  >
                    {status.delta >= 0 ? '▲' : '▼'} {Math.abs(status.delta)}% vs last month
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <CardTitle>Activity feed</CardTitle>
              <Badge variant="secondary">Live</Badge>
            </div>
            <ol className="relative space-y-4 border-l border-dashed border-slate-200 pl-4">
              {MOCK_ACTIVITY_FEED.map((item) => (
                <li key={item.id} className="relative">
                  <span
                    className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white"
                    style={{ background: item.tone === 'muted' ? '#94a3b8' : TEAL }}
                  />
                  <p className="text-sm font-medium leading-snug text-slate-700">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                    {item.time}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
