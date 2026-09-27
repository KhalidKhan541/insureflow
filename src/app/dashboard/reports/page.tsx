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
import { MOCK_AGENTS, MOCK_CLAIMS, MOCK_POLICIES, MOCK_PREMIUMS } from '@/lib/mock-data';
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

const LOB_LABEL: Record<string, string> = {
  personal_auto: 'Personal auto',
  homeowners: 'Homeowners',
  commercial_auto: 'Commercial auto',
  commercial_property: 'Commercial property',
  general_liability: 'General liability',
  workers_compensation: "Workers' comp",
  cyber: 'Cyber',
  professional_indemnity: 'Professional indemnity',
  marine: 'Marine',
  life: 'Life',
};

const CONTROL_CLASS =
  'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

/* ------------------------------------------------------------------ */
/* Derived datasets                                                    */
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

/** In-force book grouped by line of business, straight from the policy book. */
const PORTFOLIO_ROWS: SummaryRow[] = (() => {
  const groups = new Map<string, { count: number; premium: number }>();
  for (const policy of MOCK_POLICIES) {
    const entry = groups.get(policy.lineOfBusiness) ?? { count: 0, premium: 0 };
    entry.count += 1;
    entry.premium += policy.premium;
    groups.set(policy.lineOfBusiness, entry);
  }
  // Share is measured against the largest book so the bars stay readable.
  const largest = Math.max(...[...groups.values()].map((value) => value.premium), 1);
  return [...groups.entries()]
    .map(([lob, value]) => ({
      key: lob,
      label: LOB_LABEL[lob] ?? lob,
      sub: `${value.count} polic${value.count === 1 ? 'y' : 'ies'}`,
      value: formatCurrency(value.premium, 'USD', { maximumFractionDigits: 0 }),
      secondary: `${formatCurrency(value.premium / value.count, 'USD', { maximumFractionDigits: 0 })} avg`,
      share: value.premium / largest,
    }))
    .sort((a, b) => b.share - a.share);
})();

/** Incurred loss and loss ratio per cause of loss. */
const CLAIMS_ROWS: SummaryRow[] = (() => {
  const groups = new Map<string, { claimed: number; paid: number; count: number }>();
  for (const claim of MOCK_CLAIMS) {
    const entry = groups.get(claim.causeOfLoss) ?? { claimed: 0, paid: 0, count: 0 };
    entry.claimed += claim.amountClaimed;
    entry.paid += claim.amountPaid;
    entry.count += 1;
    groups.set(claim.causeOfLoss, entry);
  }
  const rows = [...groups.entries()].map(([cause, value]) => ({
    key: cause,
    label: cause,
    sub: `${value.count} claim${value.count === 1 ? '' : 's'}`,
    value: formatCurrency(value.claimed, 'USD', { maximumFractionDigits: 0 }),
    secondary: `${value.claimed > 0 ? Math.round((value.paid / value.claimed) * 100) : 0}% paid`,
    share: 0,
    tone: 'text-slate-800' as string,
  }));
  const largest = Math.max(...[...groups.values()].map((value) => value.claimed), 1);
  for (const row of rows) {
    row.share = (groups.get(row.key)?.claimed ?? 0) / largest;
  }
  return rows.sort((a, b) => b.share - a.share).slice(0, 8);
})();

/** Financial summary — share of written premium for the selected period. */
const FINANCIAL_ROWS: SummaryRow[] = (() => {
  const totals = MOCK_PREMIUMS.reduce(
    (acc, month) => ({
      written: acc.written + month.writtenPremium,
      earned: acc.earned + month.earnedPremium,
      claims: acc.claims + month.claimsIncurred,
      commission: acc.commission + month.commissionPaid,
      collected: acc.collected + month.premiumCollected,
      outstanding: acc.outstanding + month.premiumOutstanding,
      refunds: acc.refunds + month.refundsIssued,
    }),
    { written: 0, earned: 0, claims: 0, commission: 0, collected: 0, outstanding: 0, refunds: 0 },
  );
  const money = (value: number) => formatCurrency(value, 'USD', { maximumFractionDigits: 0 });
  const operating = totals.written - totals.claims - totals.commission - totals.refunds;
  return [
    { key: 'earned', label: 'Earned premium', sub: 'Recognized revenue', value: money(totals.earned), secondary: `${formatPercent(totals.earned / totals.written, { digits: 1 })} of written`, share: totals.earned / totals.written, tone: 'text-teal-700' },
    { key: 'claims', label: 'Claims incurred', sub: 'Paid + reserve movement', value: money(totals.claims), secondary: `${formatPercent(totals.claims / totals.earned, { digits: 1 })} loss ratio`, share: totals.claims / totals.written },
    { key: 'commission', label: 'Commissions paid', sub: 'Agent & broker payouts', value: money(totals.commission), secondary: `${formatPercent(totals.commission / totals.written, { digits: 1 })} of premium`, share: totals.commission / totals.written },
    { key: 'collected', label: 'Premium collected', sub: 'Cash received', value: money(totals.collected), secondary: `${money(totals.outstanding)} outstanding`, share: totals.collected / totals.written },
    { key: 'refunds', label: 'Refunds issued', sub: 'Cancellations & endorsements', value: money(totals.refunds), secondary: `${formatPercent(totals.refunds / totals.written, { digits: 2 })} of premium`, share: totals.refunds / totals.written },
    { key: 'margin', label: 'Underwriting margin', sub: 'Pre-tax, before expenses', value: money(operating), secondary: `${formatPercent(operating / totals.written, { digits: 1 })} margin`, share: operating / totals.written, tone: 'text-teal-700' },
  ];
})();

/** Producer leaderboard from the agent book. */
const AGENT_ROWS: SummaryRow[] = (() => {
  const sorted = [...MOCK_AGENTS].sort((a, b) => b.bookOfBusiness - a.bookOfBusiness);
  const largest = sorted[0]?.bookOfBusiness ?? 1;
  return sorted.map((agent) => ({
    key: agent.id,
    label: agent.name,
    sub: `${agent.agency} · ${agent.performance.replace('_', ' ')}`,
    value: formatCurrency(agent.bookOfBusiness, 'USD', { maximumFractionDigits: 0 }),
    secondary: `${formatNumber(agent.policyCount)} policies · ${formatPercent(agent.retentionRate, { digits: 0 })} retained`,
    share: agent.bookOfBusiness / largest,
  }));
})();

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

/** Monthly written vs earned premium. */
const PREMIUM_SERIES = MOCK_PREMIUMS.map((month) => ({
  month: month.label.replace(' 2026', ''),
  written: month.writtenPremium,
  earned: month.earnedPremium,
  claims: month.claimsPaid,
  commission: month.commissionPaid,
  lossRatio: Math.round(month.lossRatio * 1000) / 10,
  combined: Math.round(month.combinedRatio * 1000) / 10,
}));

/** Claims grouped by severity (mock severity is lowercase). */
const SEVERITY_BAR = (() => {
  const order = ['critical', 'high', 'medium', 'low'] as const;
  const counts = new Map<string, number>();
  for (const claim of MOCK_CLAIMS) {
    counts.set(claim.severity, (counts.get(claim.severity) ?? 0) + 1);
  }
  return order.map((severity) => ({
    severity: severity[0].toUpperCase() + severity.slice(1),
    count: counts.get(severity) ?? 0,
  }));
})();

const SEVERITY_COLORS: Record<string, string> = {
  Critical: '#e11d48',
  High: '#f59e0b',
  Medium: TEAL,
  Low: '#94a3b8',
};

/** Claims reported per month across the book. */
const CLAIM_VOLUME = (() => {
  const buckets = new Map<string, { opened: number; paid: number }>();
  for (const claim of MOCK_CLAIMS) {
    const date = new Date(claim.reportedAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = date.toLocaleDateString('en-US', { month: 'short' });
    const entry = buckets.get(key) ?? { opened: 0, paid: 0 };
    entry.opened += 1;
    entry.paid += claim.amountPaid > 0 ? 1 : 0;
    buckets.set(key, entry);
  }
  return [...buckets.entries()].map(([month, value]) => ({ month, ...value }));
})();

const METRICS: Record<Tab, { label: string; value: string; hint: string; delta: string; up: boolean }[]> = {
  Portfolio: [
    { label: 'Policies in force', value: formatNumber(MOCK_POLICIES.length), hint: 'Sample book', delta: '+2.6%', up: true },
    { label: 'Written premium', value: formatCurrency(MOCK_PREMIUMS.reduce((s, m) => s + m.writtenPremium, 0), 'USD', { notation: 'compact' }), hint: 'Selected range', delta: '+12.4%', up: true },
    { label: 'New business mix', value: formatPercent(MOCK_PREMIUMS.reduce((s, m) => s + m.newBusinessPremium, 0) / MOCK_PREMIUMS.reduce((s, m) => s + m.writtenPremium, 0), { digits: 1 }), hint: 'vs renewals', delta: '+3.1%', up: true },
    { label: 'Combined ratio', value: formatPercent(MOCK_PREMIUMS[MOCK_PREMIUMS.length - 1]?.combinedRatio ?? 0, { digits: 1 }), hint: 'Latest month', delta: '−1.4 pts', up: true },
  ],
  Claims: [
    { label: 'Claims in book', value: formatNumber(MOCK_CLAIMS.length), hint: 'All severities', delta: '+4.2%', up: true },
    { label: 'Incurred loss', value: formatCurrency(MOCK_PREMIUMS.reduce((s, m) => s + m.claimsIncurred, 0), 'USD', { notation: 'compact' }), hint: 'Selected range', delta: '+6.8%', up: true },
    { label: 'Paid to date', value: formatCurrency(MOCK_CLAIMS.reduce((s, c) => s + c.amountPaid, 0), 'USD', { notation: 'compact' }), hint: 'Across sampled claims', delta: '+5.1%', up: true },
    { label: 'Fraud flag rate', value: formatPercent(MOCK_CLAIMS.filter((c) => c.fraudScore >= 60).length / MOCK_CLAIMS.length, { digits: 1 }), hint: 'Score ≥ 60', delta: '−0.6 pts', up: true },
  ],
  Financial: [
    { label: 'Earned premium', value: formatCurrency(MOCK_PREMIUMS.reduce((s, m) => s + m.earnedPremium, 0), 'USD', { notation: 'compact' }), hint: 'Recognized', delta: '+11.2%', up: true },
    { label: 'Loss ratio', value: formatPercent(MOCK_PREMIUMS[MOCK_PREMIUMS.length - 1]?.lossRatio ?? 0, { digits: 1 }), hint: 'Target 62.0%', delta: '+2.4 pts', up: true },
    { label: 'Expense ratio', value: formatPercent(MOCK_PREMIUMS[MOCK_PREMIUMS.length - 1]?.expenseRatio ?? 0, { digits: 1 }), hint: 'Budget 20.0%', delta: '−0.8 pts', up: true },
    { label: 'Commission paid', value: formatCurrency(MOCK_PREMIUMS.reduce((s, m) => s + m.commissionPaid, 0), 'USD', { notation: 'compact' }), hint: 'Selected range', delta: '+7.4%', up: true },
  ],
  Agents: [
    { label: 'Active agents', value: formatNumber(MOCK_AGENTS.filter((a) => a.status === 'active').length), hint: `${MOCK_AGENTS.length} appointed`, delta: '+3', up: true },
    { label: 'Book under management', value: formatCurrency(MOCK_AGENTS.reduce((s, a) => s + a.bookOfBusiness, 0), 'USD', { notation: 'compact' }), hint: 'All agents', delta: '+8.9%', up: true },
    { label: 'Avg. retention', value: formatPercent(MOCK_AGENTS.reduce((s, a) => s + a.retentionRate, 0) / MOCK_AGENTS.length, { digits: 1 }), hint: 'Trailing 12 months', delta: '+1.1 pts', up: true },
    { label: 'Commission YTD', value: formatCurrency(MOCK_AGENTS.reduce((s, a) => s + a.commissionYtd, 0), 'USD', { notation: 'compact' }), hint: 'Paid to agents', delta: '+7.4%', up: true },
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
                  i > 0 && 'text-right',
                  col.align === 'left' && 'text-left',
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
              <td className="py-2.5 pr-4 text-left">
                <p className="font-medium text-slate-800">{row.label}</p>
                {row.sub ? <p className="text-xs text-slate-400">{row.sub}</p> : null}
              </td>
              <td className={cn('py-2.5 pr-4 text-right font-semibold tabular-nums', row.tone ?? 'text-slate-800')}>
                {row.value}
              </td>
              <td className="py-2.5 pr-4 text-right text-xs text-slate-500">{row.secondary}</td>
              <td className="py-2.5 text-right">
                <div className="flex justify-end">
                  <ShareBar share={row.share} />
                </div>
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
  const mix = (() => {
    const counts = new Map<string, number>();
    for (const policy of MOCK_POLICIES) {
      counts.set(policy.lineOfBusiness, (counts.get(policy.lineOfBusiness) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([lob, value]) => ({ type: LOB_LABEL[lob] ?? lob, value }))
      .sort((a, b) => b.value - a.value);
  })();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Written vs earned premium</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Monthly trend across the selected range</p>
            </div>
            <Badge variant="outline">Area</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PREMIUM_SERIES} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="repPremiumFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="repEarnedFill" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(v: number) => `${Math.round(v / 1_000_000)}M`}
                  width={40}
                />
                <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v, 'USD', { maximumFractionDigits: 0 })} />} />
                <Area type="monotone" dataKey="written" stroke={TEAL} strokeWidth={2} fill="url(#repPremiumFill)" />
                <Area type="monotone" dataKey="earned" stroke={TEAL_SOFT} strokeWidth={2} fill="url(#repEarnedFill)" />
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
            {formatNumber(MOCK_POLICIES.length)} policies in the sample book
          </p>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Portfolio summary by line of business</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Premium share across the book</p>
          </div>
          <Badge variant="outline">{PORTFOLIO_ROWS.length} lines</Badge>
        </div>
        <SummaryTable
          head={[{ label: 'Line of business', align: 'left' }, { label: 'Premium', align: 'right' }, { label: 'Detail', align: 'right' }, { label: 'Share', align: 'right' }]}
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
              <BarChart data={SEVERITY_BAR} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="severity" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={32} allowDecimals={false} />
                <Tooltip content={<ChartTooltip formatter={(v: number) => `${formatNumber(v)} claims`} />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {SEVERITY_BAR.map((entry) => (
                    <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] ?? TEAL} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Reported vs paid claims</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Claim throughput by month</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL }} />
                Reported
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL_SOFT }} />
                Paid
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
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={32} allowDecimals={false} />
                <Tooltip content={<ChartTooltip formatter={(v: number) => `${formatNumber(v)} claims`} />} />
                <Area type="monotone" dataKey="opened" stroke={TEAL} strokeWidth={2} fill="url(#openedFill)" />
                <Area type="monotone" dataKey="paid" stroke={TEAL_SOFT} strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Incurred loss by cause of loss</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Claimed amount and payout ratio per cause</p>
          </div>
          <Badge variant="outline">{MOCK_CLAIMS.length} claims</Badge>
        </div>
        <SummaryTable
          head={[{ label: 'Cause of loss', align: 'left' }, { label: 'Claimed', align: 'right' }, { label: 'Paid ratio', align: 'right' }, { label: 'Share', align: 'right' }]}
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
              <CardTitle>Claims paid vs commission outflow</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Monthly cost of the book</p>
            </div>
            <Badge variant="outline">Area</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PREMIUM_SERIES} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="claimsPaidFill" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(v: number) => `${Math.round(v / 1_000_000)}M`}
                  width={40}
                />
                <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v, 'USD', { maximumFractionDigits: 0 })} />} />
                <Area type="monotone" dataKey="claims" stroke={TEAL} strokeWidth={2} fill="url(#claimsPaidFill)" />
                <Area type="monotone" dataKey="commission" stroke={TEAL_SOFT} strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Loss & combined ratio</CardTitle>
            <Badge variant="warning">Target 62%</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PREMIUM_SERIES} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={32} unit="%" />
                <Tooltip content={<ChartTooltip formatter={(v: number) => `${v.toFixed(1)}%`} />} />
                <Bar dataKey="lossRatio" fill={TEAL} radius={[4, 4, 0, 0]} />
                <Bar dataKey="combined" fill={TEAL_SOFT} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Financial summary</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Share of written premium for the range</p>
          </div>
          <Badge variant="outline">YTD</Badge>
        </div>
        <SummaryTable
          head={[{ label: 'Line item', align: 'left' }, { label: 'Amount', align: 'right' }, { label: 'Ratio', align: 'right' }, { label: 'Share', align: 'right' }]}
          rows={FINANCIAL_ROWS}
        />
      </Card>
    </div>
  );
}

function AgentsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Book of business by agent</CardTitle>
              <p className="mt-1 text-xs text-slate-500">Appointed producers ranked by premium</p>
            </div>
            <Badge variant="outline">Bar</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...MOCK_AGENTS]
                  .sort((a, b) => b.bookOfBusiness - a.bookOfBusiness)
                  .map((agent) => ({ name: agent.name.split(' ')[0], book: agent.bookOfBusiness }))}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v: number) => `${Math.round(v / 1_000_000)}M`}
                  width={40}
                />
                <Tooltip content={<ChartTooltip formatter={(v: number) => formatCurrency(v, 'USD', { maximumFractionDigits: 0 })} />} />
                <Bar dataKey="book" fill={TEAL} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Retention by agent</CardTitle>
            <Badge variant="success">
              {formatPercent(MOCK_AGENTS.reduce((s, a) => s + a.retentionRate, 0) / MOCK_AGENTS.length, { digits: 1 })}
            </Badge>
          </div>
          <ul className="space-y-3">
            {[...MOCK_AGENTS]
              .sort((a, b) => b.retentionRate - a.retentionRate)
              .map((agent) => (
                <li key={agent.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{agent.name}</span>
                    <span className="tabular-nums text-slate-500">
                      {formatPercent(agent.retentionRate, { digits: 0 })}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${agent.retentionRate * 100}%`,
                        background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL_SOFT} 100%)`,
                      }}
                    />
                  </div>
                </li>
              ))}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Agent production summary</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Share of managed book across appointed agents</p>
          </div>
          <Badge variant="outline">{MOCK_AGENTS.length} agents</Badge>
        </div>
        <SummaryTable
          head={[{ label: 'Agent', align: 'left' }, { label: 'Book', align: 'right' }, { label: 'Detail', align: 'right' }, { label: 'Share', align: 'right' }]}
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
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={32} allowDecimals={false} />
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
          head={[{ label: 'Obligation', align: 'left' }, { label: 'Status', align: 'right' }, { label: 'Detail', align: 'right' }, { label: 'Progress', align: 'right' }]}
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
    const windowLabel = range === 'custom' ? `${fromDate} → ${toDate}` : rangeLabel;
    setNotice(
      kind === 'Schedule'
        ? `Weekly ${activeTab} report scheduled · ${windowLabel} · delivered Mondays 07:00`
        : `${activeTab} report queued as ${kind} · ${windowLabel}`,
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
