'use client';

import { useState } from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
import {
  MOCK_CLAIMS_SEVERITY,
  MOCK_COMMISSION_SPEND,
  MOCK_LOSS_RATIO_BY_PRODUCT,
  MOCK_POLICY_MIX,
  MOCK_PREMIUM_GROWTH,
  MOCK_RETENTION_TREND,
} from '@/lib/mock-data';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

const TEAL = '#0d9488';
const TABS = ['Overview', 'Claims', 'Policies', 'Revenue'] as const;
type Tab = (typeof TABS)[number];

const PIE_PALETTE = [
  '#0d9488',
  '#14b8a6',
  '#2dd4bf',
  '#5eead4',
  '#99f6e4',
  '#ccfbf1',
  '#0f766e',
];

const SEVERITY_COLORS: Record<string, string> = {
  Critical: '#e11d48',
  High: '#f59e0b',
  Medium: '#0d9488',
  Low: '#94a3b8',
};

/** Whole-dollar currency label, used across chart tooltips and KPI values. */
const money = (value: number) => formatCurrency(value, 'USD', { maximumFractionDigits: 0 });

/** Short currency label, e.g. `$48.2M`. */
const moneyCompact = (value: number) =>
  formatCurrency(value, 'USD', { notation: 'compact', maximumFractionDigits: 1 });

function ChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-semibold text-slate-500">{label ?? payload[0]?.name}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey ?? entry.name} className="text-xs font-medium" style={{ color: entry.color ?? entry.fill }}>
          {entry.name ?? entry.dataKey}:{' '}
          {formatter ? formatter(entry.value) : formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const maxCommission = Math.max(...MOCK_COMMISSION_SPEND.map((m) => m.commission));
  const severityTotal = MOCK_CLAIMS_SEVERITY.reduce((sum, s) => sum + s.value, 0);
  const policyTotal = MOCK_POLICY_MIX.reduce((sum, p) => sum + p.value, 0);
  const currentPeriodTotal = MOCK_PREMIUM_GROWTH.reduce((sum, m) => sum + m.current, 0);
  const priorPeriodTotal = MOCK_PREMIUM_GROWTH.reduce((sum, m) => sum + m.prior, 0);
  const premiumGrowth = ((currentPeriodTotal - priorPeriodTotal) / priorPeriodTotal) * 100;

  const overviewMetrics = [
    {
      key: 'premium-growth',
      label: 'Premium growth (YoY)',
      value: formatPercent(premiumGrowth / 100),
      delta: premiumGrowth,
      deltaLabel: 'vs prior year',
      hint: `${moneyCompact(currentPeriodTotal)} vs ${moneyCompact(priorPeriodTotal)} prior year`,
      trend: premiumGrowth >= 0 ? ('up' as const) : ('down' as const),
      format: 'raw' as const,
    },
    {
      key: 'loss-ratio',
      label: 'Blended loss ratio',
      value:
        MOCK_LOSS_RATIO_BY_PRODUCT.reduce((sum, p) => sum + p.lossRatio, 0) /
        MOCK_LOSS_RATIO_BY_PRODUCT.length /
        100,
      delta: 2.4,
      deltaLabel: 'pts better than target',
      hint: 'Target 62.0%',
      trend: 'up' as const,
      format: 'percent' as const,
    },
    {
      key: 'retention',
      label: 'Customer retention',
      value: MOCK_RETENTION_TREND[MOCK_RETENTION_TREND.length - 1].retention / 100,
      delta: 1.3,
      deltaLabel: 'pts vs last year',
      hint: '12-month rolling',
      trend: 'up' as const,
      format: 'percent' as const,
    },
    {
      key: 'commission',
      label: 'Commission spend (YTD)',
      value: MOCK_COMMISSION_SPEND.reduce((sum, m) => sum + m.commission, 0),
      delta: 1.8,
      deltaLabel: '% under plan',
      hint: `${formatPercent(
        MOCK_COMMISSION_SPEND.reduce((sum, m) => sum + m.commission, 0) /
          MOCK_COMMISSION_SPEND.reduce((sum, m) => sum + m.premium, 0),
      )} of premium`,
      trend: 'up' as const,
      format: 'currency' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Premium, claims, policy mix and revenue performance across the book.
          </p>
        </div>
        <Badge variant="outline">FY 2026 · 9 periods</Badge>
      </header>

      {/* ---------- Tabs ---------- */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100/70 p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------- Overview ---------- */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewMetrics.map((metric) => (
              <MetricCard
                key={metric.key}
                label={metric.label}
                value={
                  metric.format === 'currency'
                    ? money(metric.value)
                    : metric.format === 'percent'
                      ? formatPercent(metric.value)
                      : metric.value
                }
                delta={metric.delta}
                deltaLabel={metric.deltaLabel}
                hint={metric.hint}
                trend={metric.trend}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <CardTitle>Premium growth trend</CardTitle>
                  <p className="mt-1 text-xs text-slate-500">
                    Written premium vs same period last year ·{' '}
                    <span className="font-medium text-teal-600">
                      +{formatPercent(premiumGrowth / 100)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL }} />
                    Current year
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    Prior year
                  </span>
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_PREMIUM_GROWTH} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
                      width={48}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                    />
                    <Tooltip content={<ChartTooltip formatter={money} />} />
                    <Line
                      type="monotone"
                      dataKey="current"
                      name="Current year"
                      stroke={TEAL}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: TEAL }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="prior"
                      name="Prior year"
                      stroke="#cbd5e1"
                      strokeWidth={2}
                      strokeDasharray="5 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <CardTitle>Policy mix</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                {formatNumber(policyTotal)} in-force policies by product line
              </p>
              <div className="mt-2 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_POLICY_MIX}
                      dataKey="value"
                      nameKey="type"
                      innerRadius={54}
                      outerRadius={84}
                      paddingAngle={2}
                      stroke="#ffffff"
                    >
                      {MOCK_POLICY_MIX.map((_, index) => (
                        <Cell key={index} fill={PIE_PALETTE[index % PIE_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip formatter={formatNumber} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1.5">
                {MOCK_POLICY_MIX.map((slice, index) => (
                  <li
                    key={slice.type}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 text-slate-600">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ background: PIE_PALETTE[index % PIE_PALETTE.length] }}
                      />
                      {slice.type}
                    </span>
                    <span className="font-medium text-slate-700">
                      {formatNumber(slice.value)} · {formatPercent(slice.value / policyTotal, { digits: 0 })}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* ---------- Claims ---------- */}
      {activeTab === 'Claims' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <CardTitle>Loss ratio by product</CardTitle>
                <p className="mt-1 text-xs text-slate-500">
                  Paid + reserved losses as a share of earned premium
                </p>
              </div>
              <Badge variant="outline">Target ≤ 62%</Badge>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_LOSS_RATIO_BY_PRODUCT} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
                    width={44}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<ChartTooltip formatter={(v: number) => formatPercent(v / 100)} />} />
                  <Bar dataKey="lossRatio" name="Loss ratio" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {MOCK_LOSS_RATIO_BY_PRODUCT.map((entry) => (
                      <Cell
                        key={entry.product}
                        fill={entry.lossRatio > 62 ? '#f59e0b' : TEAL}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardTitle>Claims severity mix</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {formatNumber(severityTotal)} open claims by severity band
            </p>
            <div className="mt-2 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_CLAIMS_SEVERITY}
                    dataKey="value"
                    nameKey="severity"
                    innerRadius={54}
                    outerRadius={84}
                    paddingAngle={2}
                    stroke="#ffffff"
                  >
                    {MOCK_CLAIMS_SEVERITY.map((slice) => (
                      <Cell key={slice.severity} fill={SEVERITY_COLORS[slice.severity] ?? TEAL} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip formatter={formatNumber} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1.5">
              {MOCK_CLAIMS_SEVERITY.map((slice) => (
                <li key={slice.severity} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ background: SEVERITY_COLORS[slice.severity] ?? TEAL }}
                    />
                    {slice.severity}
                  </span>
                  <span className="font-medium text-slate-700">
                    {formatNumber(slice.value)} ·{' '}
                    {formatPercent(slice.value / severityTotal, { digits: 0 })}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* ---------- Policies ---------- */}
      {activeTab === 'Policies' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <CardTitle>Customer retention</CardTitle>
                <p className="mt-1 text-xs text-slate-500">
                  12-month rolling renewal retention across all products
                </p>
              </div>
              <Badge variant="success">
                {MOCK_RETENTION_TREND[MOCK_RETENTION_TREND.length - 1].retention.toFixed(1)}% current
              </Badge>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_RETENTION_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[80, 100]}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<ChartTooltip formatter={(v: number) => `${v.toFixed(1)}%`} />} />
                  <Line
                    type="monotone"
                    dataKey="retention"
                    name="Retention"
                    stroke={TEAL}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: TEAL }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardTitle>Policy mix</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              In-force distribution by product line
            </p>
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_POLICY_MIX}
                    dataKey="value"
                    nameKey="type"
                    innerRadius={54}
                    outerRadius={84}
                    paddingAngle={2}
                    stroke="#ffffff"
                  >
                    {MOCK_POLICY_MIX.map((_, index) => (
                      <Cell key={index} fill={PIE_PALETTE[index % PIE_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip formatter={formatNumber} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1.5">
              {MOCK_POLICY_MIX.map((slice, index) => (
                <li key={slice.type} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ background: PIE_PALETTE[index % PIE_PALETTE.length] }}
                    />
                    {slice.type}
                  </span>
                  <span className="font-medium text-slate-700">
                    {formatNumber(slice.value)} · {formatPercent(slice.value / policyTotal, { digits: 0 })}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* ---------- Revenue ---------- */}
      {activeTab === 'Revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Commission spend (YTD)"
              value={money(
                MOCK_COMMISSION_SPEND.reduce((sum, m) => sum + m.commission, 0),
              )}
              delta={1.8}
              deltaLabel="% under plan"
              hint="Across all channels"
              trend="up"
            />
            <MetricCard
              label="Commission ratio"
              value={formatPercent(
                MOCK_COMMISSION_SPEND.reduce((sum, m) => sum + m.commission, 0) /
                  MOCK_COMMISSION_SPEND.reduce((sum, m) => sum + m.premium, 0),
              )}
              delta={0.6}
              deltaLabel="pts better than last year"
              hint="Commission ÷ written premium"
              trend="up"
            />
            <MetricCard
              label="Earned premium (YTD)"
              value={money(
                MOCK_COMMISSION_SPEND.reduce((sum, m) => sum + m.premium, 0),
              )}
              delta={8.2}
              deltaLabel="vs last year"
              hint="All product lines"
              trend="up"
            />
            <MetricCard
              label="Avg commission / month"
              value={money(
                MOCK_COMMISSION_SPEND.reduce((sum, m) => sum + m.commission, 0) /
                  MOCK_COMMISSION_SPEND.length,
              )}
              delta={1.9}
              deltaLabel="vs trailing quarter"
              hint={`${MOCK_COMMISSION_SPEND.length} periods`}
              trend="up"
            />
          </div>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <CardTitle>Commission spend vs premium</CardTitle>
                <p className="mt-1 text-xs text-slate-500">
                  Monthly commission outflow against written premium
                </p>
              </div>
              <Badge variant="outline">Peak {money(maxCommission)}</Badge>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_COMMISSION_SPEND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
                    width={52}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  />
                  <Tooltip content={<ChartTooltip formatter={money} />} />
                  <Bar
                    dataKey="premium"
                    name="Written premium"
                    fill="#ccfbf1"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={34}
                  />
                  <Bar
                    dataKey="commission"
                    name="Commission"
                    fill={TEAL}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={34}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
