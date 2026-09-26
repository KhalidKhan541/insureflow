'use client';

import { useState } from 'react';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import {
  MOCK_COMMISSION_SPEND,
  MOCK_PREMIUM_CLAIMS,
  MOCK_RETENTION_TREND,
  MOCK_TOP_AGENTS,
} from '@/lib/mock-data';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

const TEAL = '#0d9488';
const TEAL_SOFT = '#5eead4';

const TABS = ['Portfolio', 'Claims', 'Financial', 'Agents', 'Compliance'] as const;
type Tab = (typeof TABS)[number];

const RANGE_PRESETS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'qtd', label: 'Quarter to date' },
  { value: 'ytd', label: 'Year to date' },
  { value: '12m', label: 'Last 12 months' },
  { value: 'custom', label: 'Custom range' },
] as const;

const PIE_PALETTE = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#0f766e'];

const CONTROL_CLASS =
  'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

/* ------------------------------------------------------------------ */
/* Static report datasets                                              */
/* ------------------------------------------------------------------ */

interface SummaryRow {
  key: string;
  label: string;
  sub?: string;
  value: string;
  secondary?: string;
  /** 0–1 share of the column total, drives the share bar. */
  share: number;
  tone?: string;
}

const PORTFOLIO_ROWS: SummaryRow[] = [
  { key: 'auto', label: 'Auto', sub: 'Personal lines', value: '4,210', secondary: '$18.4M', share: 0.42 },
  { key: 'home', label: 'Homeowners', sub: 'Personal lines', value: '2,680', secondary: '$12.1M', share: 0.27 },
  { key: 'comm', label: 'Commercial', sub: 'Small business', value: '1,520', secondary: '$9.8M', share: 0.15 },
  { key: 'life', label: 'Life', sub: 'Term & whole', value: '980', secondary: '$4.3M', share: 0.1 },
  { key: 'health', label: 'Health', sub: 'Group & individual', value: '760', secondary: '$2.6M', share: 0.08 },
  { key: 'umb', label: 'Umbrella', sub: 'Excess liability', value: '410', secondary: '$1.0M', share: 0.04 },
];

const CLAIMS_ROWS: SummaryRow[] = [
  { key: 'collision', label: 'Auto collision', sub: '142 claims', value: '$8.94M', secondary: '64.8%', share: 0.34, tone: 'text-rose-600' },
  { key: 'property', label: 'Property damage', sub: '96 claims', value: '$5.12M', secondary: '58.2%', share: 0.2 },
  { key: 'liability', label: 'General liability', sub: '54 claims', value: '$4.36M', secondary: '51.4%', share: 0.17 },
  { key: 'cargo', label: 'Commercial cargo', sub: '31 claims', value: '$3.74M', secondary: '72.1%', share: 0.14 },
  { key: 'health', label: 'Health & medical', sub: '68 claims', value: '$2.61M', secondary: '44.9%', share: 0.1 },
  { key: 'other', label: 'Other', sub: '27 claims', value: '$0.94M', secondary: '38.0%', share: 0.04 },
];

const FINANCIAL_ROWS: SummaryRow[] = [
  { key: 'earned', label: 'Earned premium', sub: 'Recognized revenue', value: '$44.9M', secondary: '93.1% of written', share: 1, tone: 'text-teal-700' },
  { key: 'claims', label: 'Claims incurred', sub: 'Paid + reserve change', value: '$27.7M', secondary: '61.8% loss ratio', share: 0.62 },
  { key: 'commissions', label: 'Commissions', sub: '42 agents', value: '$3.4M', secondary: '7.1% of premium', share: 0.08 },
  { key: 'expenses', label: 'Operating expenses', sub: 'G&A + acquisition', value: '$8.6M', secondary: '19.2% expense ratio', share: 0.19 },
  { key: 'profit', label: 'Underwriting profit', sub: 'Pre-tax', value: '$5.2M', secondary: '11.6% margin', share: 0.11, tone: 'text-teal-700' },
];

const AGENT_ROWS: SummaryRow[] = MOCK_TOP_AGENTS.map((agent) => ({
  key: agent.name,
  label: agent.name,
  sub: agent.agency,
  value: formatCurrency(agent.book),
  secondary: `${agent.policies} policies · ${formatPercent(agent.retention, 0)} retained`,
  share: agent.book / 4_820_000,
}));

const COMPLIANCE_ROWS: SummaryRow[] = [
  { key: 'naic', label: 'NAIC annual statement', sub: 'Due Mar 1, 2027', value: 'On track', secondary: '12 of 12 filings', share: 1, tone: 'text-teal-700' },
  { key: 'doi', label: 'State DOI market conduct', sub: '8 jurisdictions', value: 'On track', secondary: '8 of 8 submitted', share: 1, tone: 'text-teal-700' },
  { key: 'aml', label: 'AML / OFAC screening', sub: 'Quarterly attestation', value: 'In review', secondary: 'Q3 attestation pending', share: 0.72, tone: 'text-amber-600' },
  { key: 'sox', label: 'SOX 404 controls', sub: 'Finance controls', value: 'In review', secondary: '17 of 24 controls tested', share: 0.71, tone: 'text-amber-600' },
  { key: 'gdpr', label: 'Data privacy (GDPR/CCPA)', sub: 'DSAR backlog', value: 'Action needed', secondary: '6 requests over SLA', share: 0.45, tone: 'text-rose-600' },
];

const FILINGS_PIE = [
  { name: 'On time', value: 34 },
  { name: 'Submitted late', value: 3 },
  { name: 'In preparation', value: 7 },
  { name: 'Not started', value: 2 },
];

const FINDINGS_BAR = [
  { finding: 'Critical', count: 2 },
  { finding: 'High', count: 5 },
  { finding: 'Medium', count: 11 },
  { finding: 'Low', count: 18 },
];

const CLAIM_VOLUME = [
  { month: 'Apr', opened: 118, closed: 104 },
  { month: 'May', opened: 127, closed: 121 },
  { month: 'Jun', opened: 141, closed: 133 },
  { month: 'Jul', opened: 134, closed: 147 },
  { month: 'Aug', opened: 152, closed: 139 },
  { month: 'Sep', opened: 146, closed: 158 },
];

const METRICS: Record<Tab, { label: string; value: string; hint: string; delta: string; up: boolean }[]> = {
  Portfolio: [
    { label: 'Policies in force', value: '10,560', hint: '6 lines of business', delta: '+2.6%', up: true },
    { label: 'Written premium', value: '$48.2M', hint: 'Year to date', delta: '+12.4%', up: true },
    { label: 'Average premium', value: '$4,568', hint: 'Per policy', delta: '+3.1%', up: true },
    { label: 'Renewal book', value: '94.2%', hint: '12-month rolling', delta: '+1.3 pts', up: true },
  ],
  Claims: [
    { label: 'Claims opened', value: '818', hint: 'Apr – Sep', delta: '+4.2%', up: true },
    { label: 'Claims closed', value: '802', hint: 'Apr – Sep', delta: '+9.6%', up: true },
    { label: 'Incurred loss', value: '$25.7M', hint: '6 months', delta: '+6.8%', up: true },
    { label: 'Avg. cycle time', value: '18.4d', hint: 'Report to settlement', delta: '−2.1d', up: true },
  ],
  Financial: [
    { label: 'Earned premium', value: '$44.9M', hint: '93.1% of written', delta: '+11.2%', up: true },
    { label: 'Loss ratio', value: '61.8%', hint: 'Target 62.0%', delta: '+2.4 pts', up: true },
    { label: 'Expense ratio', value: '19.2%', hint: 'Budget 20.0%', delta: '−0.8 pts', up: true },
    { label: 'Combined ratio', value: '81.0%', hint: 'Underwriting margin', delta: '−3.4 pts', up: true },
  ],
  Agents: [
    { label: 'Active agents', value: '42', hint: '11 agencies', delta: '+3', up: true },
    { label: 'Book under management', value: '$17.1M', hint: 'Top 5 agents', delta: '+8.9%', up: true },
    { label: 'Avg. retention', value: '93.2%', hint: 'Top 5 agents', delta: '+1.1 pts', up: true },
    { label: 'Commission paid', value: '$3.4M', hint: 'Year to date', delta: '+7.4%', up: true },
  ],
  Compliance: [
    { label: 'Filings on time', value: '34 / 37', hint: 'Rolling 12 months', delta: '91.9%', up: true },
    { label: 'Open findings', value: '36', hint: '2 critical', delta: '−8', up: true },
    { label: 'Audit readiness', value: '88%', hint: 'Controls tested', delta: '+6 pts', up: true },
    { label: 'DSAR SLA', value: '94.6%', hint: '6 over SLA', delta: '−1.2 pts', up: false },
  ],
};

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

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
          {formatter ? formatter(entry.value) : formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
}

function ShareBar({ share, tone }: { share: number; tone?: string }) {
  const pct = Math.max(0, Math.min(1, share)) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full max-w-[140px] overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: tone
              ? undefined
              : `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_SOFT} 100%)`,
            backgroundColor: tone ? 'currentColor' : undefined,
          }}
        />
      </div>
      <span className="w-9 text-right text-[11px] tabular-nums text-slate-500">
        {Math.round(pct)}%
      </span>
    </div>
  );
}

function SummaryTable({
  head,
  rows,
}: {
  head: { label: string; align?: 'left' | 'right' }[];
  rows: SummaryRow[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            {head.map((col, i) => (
              <th
                key={col.label}
                className={cn(
                  'pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400',
                  col.align === 'right' && 'text-right',
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-slate-100 last:border-0">
              <td className="py-2.5 pr-4">
                <p className="font-medium text-slate-800">{row.label}</p>
                {row.sub ? <p className="text-xs text-slate-400">{row.sub}</p> : null}
              </td>
              <td className={cn('py-2.5 pr-4 text-right font-semibold tabular-nums', row.tone ?? 'text-slate-800')}>
                {row.value}
              </td>
              <td className="py-2.5 pr-4 text-right text-xs text-slate-500">{row.secondary}</td>
              <td className="py-2.5">
                <ShareBar share={row.share} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricStrip({ tab }: { tab: Tab }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {METRICS[tab].map((metric) => (
        <Card key={metric.label} className="!p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {metric.label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">{metric.value}</p>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-slate-500">{metric.hint}</span>
            <span className={cn('font-medium', metric.up ? 'text-teal-600' : 'text-rose-500')}>
              {metric.up ? '▲' : '▼'} {metric.delta}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab bodies                                                          */
/* ------------------------------------------------------------------ */

function PortfolioTab() {
  const mixTotal = 4_210 + 2_680 + 1_520 + 980 + 760 + 410;
  const mix = [
    { type: 'Auto', value: 4_210 },
    { type: 'Homeowners', value: 2_680 },
    { type: 'Commercial', value: 1_520 },
    { type: 'Life', value: 980 },
    { type: 'Health', value: 760 },
    { type: 'Umbrella', value: 410 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Written premium vs claims paid</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Monthly trend across the selected range</p>
            </div>
            <Badge variant="outline">Area</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_PREMIUM_CLAIMS} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="repPremiumFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="repClaimsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL_SOFT} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={TEAL_SOFT} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`}
                  width={40}
                />
                <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v)} />} />
                <Area type="monotone" dataKey="premium" stroke={TEAL} strokeWidth={2} fill="url(#repPremiumFill)" />
                <Area type="monotone" dataKey="claims" stroke={TEAL_SOFT} strokeWidth={2} fill="url(#repClaimsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Policy mix</CardTitle>
            <Badge variant="secondary">In force</Badge>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mix} dataKey="value" nameKey="type" innerRadius={52} outerRadius={78} paddingAngle={2}>
                  {mix.map((_, index) => (
                    <Cell key={index} fill={PIE_PALETTE[index % PIE_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={(v: number) => `${formatNumber(v)} policies`} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">
            {formatNumber(mixTotal)} policies in force
          </p>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Portfolio summary by line of business</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Share of in-force policy count</p>
          </div>
          <Badge variant="outline">6 lines</Badge>
        </div>
        <SummaryTable
          head={[{ label: 'Line of business' }, { label: 'Policies', align: 'right' }, { label: 'Premium', align: 'right' }, { label: 'Share' }]}
          rows={PORTFOLIO_ROWS}
        />
      </Card>
    </div>
  );
}

function ClaimsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Claims by severity</CardTitle>
            <Badge variant="outline">Bar</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CLAIM_VOLUME} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={32} />
                <Tooltip content={<ChartTooltip formatter={(v: number) => `${formatNumber(v)} claims`} />} />
                <Bar dataKey="opened" fill={TEAL} radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" fill={TEAL_SOFT} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Opened vs closed volume</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Six-month claim throughput</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL }} />
                Opened
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL_SOFT }} />
                Closed
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CLAIM_VOLUME} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="openedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={32} />
                <Tooltip content={<ChartTooltip formatter={(v: number) => `${formatNumber(v)} claims`} />} />
                <Area type="monotone" dataKey="opened" stroke={TEAL} strokeWidth={2} fill="url(#openedFill)" />
                <Area type="monotone" dataKey="closed" stroke={TEAL_SOFT} strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Incurred loss by cause of loss</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Share of total incurred, with pure loss ratio</p>
          </div>
          <Badge variant="outline">$25.7M incurred</Badge>
        </div>
        <SummaryTable
          head={[{ label: 'Cause of loss' }, { label: 'Incurred', align: 'right' }, { label: 'Loss ratio', align: 'right' }, { label: 'Share' }]}
          rows={CLAIMS_ROWS}
        />
      </Card>
    </div>
  );
}

function FinancialTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Commission outflow vs written premium</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Monthly acquisition cost</p>
            </div>
            <Badge variant="outline">Area</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_COMMISSION_SPEND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="commissionFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`}
                  width={40}
                />
                <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v)} />} />
                <Area type="monotone" dataKey="premium" stroke={TEAL_SOFT} strokeWidth={2} fill="none" />
                <Area type="monotone" dataKey="commission" stroke={TEAL} strokeWidth={2} fill="url(#commissionFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Loss ratio by product</CardTitle>
            <Badge variant="warning">Target 62%</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { product: 'Auto', lossRatio: 68.4 },
                  { product: 'Home', lossRatio: 57.2 },
                  { product: 'Comm', lossRatio: 63.9 },
                  { product: 'Life', lossRatio: 41.5 },
                  { product: 'Health', lossRatio: 71.8 },
                ]}
                layout="vertical"
                margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  type="category"
                  dataKey="product"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  width={54}
                />
                <Tooltip content={<ChartTooltip formatter={(v: number) => `${v.toFixed(1)}%`} />} />
                <Bar dataKey="lossRatio" fill={TEAL} radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Financial summary</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Share of earned premium</p>
          </div>
          <Badge variant="outline">YTD</Badge>
        </div>
        <SummaryTable
          head={[{ label: 'Line item' }, { label: 'Amount', align: 'right' }, { label: 'Ratio', align: 'right' }, { label: 'Share' }]}
          rows={FINANCIAL_ROWS}
        />
      </Card>
    </div>
  );
}

function AgentsTab() {
  const maxRetention = Math.max(...MOCK_RETENTION_TREND.map((r) => r.retention));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Book of business by agent</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Top five producers</p>
            </div>
            <Badge variant="outline">Bar</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_TOP_AGENTS} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`}
                  width={40}
                />
                <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v)} />} />
                <Bar dataKey="book" fill={TEAL} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Retention trend</CardTitle>
            <Badge variant="success">94.2%</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_RETENTION_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="retentionFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  domain={[Math.floor(maxRetention) - 5, Math.ceil(maxRetention) + 1]}
                  tickFormatter={(v) => `${v}%`}
                  width={38}
                />
                <Tooltip content={<ChartTooltip formatter={(v: number) => `${v.toFixed(1)}%`} />} />
                <Area type="monotone" dataKey="retention" stroke={TEAL} strokeWidth={2} fill="url(#retentionFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Agent production summary</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Share of managed book across top producers</p>
          </div>
          <Badge variant="outline">42 agents total</Badge>
        </div>
        <SummaryTable
          head={[{ label: 'Agent' }, { label: 'Book', align: 'right' }, { label: 'Detail', align: 'right' }, { label: 'Share' }]}
          rows={AGENT_ROWS}
        />
      </Card>
    </div>
  );
}

function ComplianceTab() {
  const filingsTotal = FILINGS_PIE.reduce((sum, f) => sum + f.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Regulatory filings</CardTitle>
            <Badge variant="secondary">{filingsTotal} filings</Badge>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={FILINGS_PIE} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76} paddingAngle={2}>
                  {FILINGS_PIE.map((_, index) => (
                    <Cell key={index} fill={PIE_PALETTE[index % PIE_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={(v: number) => `${formatNumber(v)} filings`} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
            {FILINGS_PIE.map((slice, index) => (
              <span key={slice.name} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: PIE_PALETTE[index % PIE_PALETTE.length] }}
                />
                {slice.name}
              </span>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Open audit findings</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Internal audit + market conduct exams</p>
            </div>
            <Badge variant="destructive">2 critical</Badge>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FINDINGS_BAR} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="finding" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={32} />
                <Tooltip content={<ChartTooltip formatter={(v: number) => `${formatNumber(v)} findings`} />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {FINDINGS_BAR.map((entry, index) => (
                    <Cell
                      key={entry.finding}
                      fill={['#e11d48', '#f59e0b', TEAL, '#94a3b8'][index % 4]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Compliance program status</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Share complete per obligation</p>
          </div>
          <Badge variant="outline">NAIC · State DOI · SOX</Badge>
        </div>
        <SummaryTable
          head={[{ label: 'Obligation' }, { label: 'Status', align: 'right' }, { label: 'Detail', align: 'right' }, { label: 'Progress' }]}
          rows={COMPLIANCE_ROWS}
        />
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Portfolio');
  const [range, setRange] = useState<string>('ytd');
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-09-26');
  const [notice, setNotice] = useState<string | null>(null);

  const rangeLabel =
    RANGE_PRESETS.find((preset) => preset.value === range)?.label ?? 'Custom range';

  function handleExport(kind: 'CSV' | 'PDF' | 'Schedule') {
    const window =
      range === 'custom' ? `${fromDate} → ${toDate}` : rangeLabel;
    setNotice(
      kind === 'Schedule'
        ? `Weekly ${activeTab} report scheduled · ${window} · delivered Mondays 07:00`
        : `${activeTab} report queued as ${kind} · ${window}`,
    );
    window.setTimeout(() => setNotice(null), 4000);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            Portfolio, claims, financial, agent and compliance reporting with scheduled exports.
          </p>
        </div>
        <Badge variant="outline">SOC 2 audited data · Refreshed hourly</Badge>
      </header>

      {/* ---------- Controls ---------- */}
      <Card className="!p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition',
                  activeTab === tab
                    ? 'bg-white text-teal-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-700',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
              Range
              <select
                value={range}
                onChange={(event) => setRange(event.target.value)}
                className={cn(CONTROL_CLASS, '!py-1.5 text-xs')}
              >
                {RANGE_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>

            {range === 'custom' ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  className={cn(CONTROL_CLASS, '!py-1.5 text-xs')}
                  aria-label="Range start"
                />
                <span className="text-xs text-slate-400">→</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => setToDate(event.target.value)}
                  className={cn(CONTROL_CLASS, '!py-1.5 text-xs')}
                  aria-label="Range end"
                />
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleExport('CSV')}>
                Export CSV
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExport('PDF')}>
                Export PDF
              </Button>
              <Button size="sm" onClick={() => handleExport('Schedule')}>
                Schedule
              </Button>
            </div>
          </div>
        </div>

        {notice ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-800">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            {notice}
          </div>
        ) : null}
      </Card>

      <MetricStrip tab={activeTab} />

      {activeTab === 'Portfolio' ? <PortfolioTab /> : null}
      {activeTab === 'Claims' ? <ClaimsTab /> : null}
      {activeTab === 'Financial' ? <FinancialTab /> : null}
      {activeTab === 'Agents' ? <AgentsTab /> : null}
      {activeTab === 'Compliance' ? <ComplianceTab /> : null}

      <p className="text-center text-xs text-slate-400">
        Showing {rangeLabel.toLowerCase()} · figures are illustrative and refreshed on the hour.
      </p>
    </div>
  );
}
