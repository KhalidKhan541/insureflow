'use client';

import { useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_AGENTS, MOCK_QUOTES } from '@/lib/mock-data';
import { cn, formatCurrency, formatDate, formatNumber, formatPercent } from '@/lib/utils';

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

const DECISION_META: Record<string, { label: string; variant: BadgeVariant }> = {
  approved: { label: 'Approved', variant: 'success' },
  declined: { label: 'Declined', variant: 'destructive' },
  needs_info: { label: 'Needs info', variant: 'warning' },
  refer: { label: 'Countered', variant: 'default' },
};

/** UI filter value → underlying `decision` value on the quote record. */
const DECISION_FILTERS: { value: string; label: string; decision: string }[] = [
  { value: 'approved', label: 'Approved', decision: 'approved' },
  { value: 'declined', label: 'Declined', decision: 'declined' },
  { value: 'needs-info', label: 'Needs info', decision: 'needs_info' },
  { value: 'countered', label: 'Countered', decision: 'refer' },
];

const CHANNEL_LABEL: Record<string, string> = {
  web: 'Web',
  agent: 'Agent',
  broker: 'Broker',
  renewal: 'Renewal',
  partner: 'Partner',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  bound: 'Bound',
  expired: 'Expired',
  withdrawn: 'Withdrawn',
};

function decisionMeta(value: string) {
  return DECISION_META[value] ?? { label: value, variant: 'secondary' as BadgeVariant };
}

/** 0 (safest) – 100 (riskiest) rendered as a coloured score pill + mini bar. */
function riskMeta(score: number): { label: string; variant: BadgeVariant; color: string } {
  if (score >= 70) return { label: 'High risk', variant: 'destructive', color: '#e11d48' };
  if (score >= 40) return { label: 'Review', variant: 'warning', color: '#f59e0b' };
  return { label: 'Low risk', variant: 'success', color: '#0d9488' };
}

function matches(value: string | undefined | null, term: string): boolean {
  if (!term) return true;
  return (value ?? '').toLowerCase().includes(term);
}

export default function QuotesPage() {
  const [query, setQuery] = useState('');
  const [decision, setDecision] = useState('all');

  /**
   * Quotes carry a channel rather than an owner, so the pipeline assigns each
   * quote to an agent deterministically (by index) for this demo.
   */
  const agentFor = (index: number) => MOCK_AGENTS[index % MOCK_AGENTS.length];

  const stats = useMemo(() => {
    const bound = MOCK_QUOTES.filter((quote) => quote.status === 'bound');
    const approved = MOCK_QUOTES.filter((quote) => quote.decision === 'approved');
    const declined = MOCK_QUOTES.filter((quote) => quote.decision === 'declined');
    const needsInfo = MOCK_QUOTES.filter((quote) => quote.decision === 'needs_info');
    const countered = MOCK_QUOTES.filter((quote) => quote.decision === 'refer');
    const decided = MOCK_QUOTES.filter((quote) => quote.decidedAt);
    const premium = MOCK_QUOTES.reduce((sum, quote) => sum + quote.premium, 0);
    const avgRisk =
      MOCK_QUOTES.reduce((sum, quote) => sum + quote.riskScore, 0) / (MOCK_QUOTES.length || 1);
    return {
      total: MOCK_QUOTES.length,
      bound: bound.length,
      approved: approved.length,
      declined: declined.length,
      needsInfo: needsInfo.length,
      countered: countered.length,
      decided: decided.length,
      conversion: MOCK_QUOTES.length > 0 ? bound.length / MOCK_QUOTES.length : 0,
      approvalRate: decided.length > 0 ? approved.length / decided.length : 0,
      premium,
      avgPremium: MOCK_QUOTES.length > 0 ? premium / MOCK_QUOTES.length : 0,
      avgRisk,
    };
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filter = DECISION_FILTERS.find((option) => option.value === decision);
    return MOCK_QUOTES.filter((quote, index) => {
      if (filter && quote.decision !== filter.decision) return false;
      if (!term) return true;
      const agent = agentFor(index);
      return (
        matches(quote.number, term) ||
        matches(quote.applicantName, term) ||
        matches(quote.applicantEmail, term) ||
        matches(quote.productName, term) ||
        matches(quote.lineOfBusiness, term) ||
        matches(CHANNEL_LABEL[quote.channel], term) ||
        matches(agent.name, term) ||
        matches(agent.agency, term)
      );
    });
  }, [query, decision]);

  const shownPremium = filtered.reduce((sum, quote) => sum + quote.premium, 0);
  const hasFilters = query.trim().length > 0 || decision !== 'all';

  const clearFilters = () => {
    setQuery('');
    setDecision('all');
  };

  const cards = [
    {
      label: 'Quotes in pipeline',
      value: formatNumber(stats.total),
      hint: `${stats.decided} decided · ${stats.total - stats.decided} awaiting decision`,
    },
    {
      label: 'Conversion rate',
      value: formatPercent(stats.conversion, { digits: 1 }),
      hint: `${stats.bound} bound to policy`,
    },
    {
      label: 'Approval rate',
      value: formatPercent(stats.approvalRate, { digits: 1 }),
      hint: `${stats.declined} declined · ${stats.needsInfo} needs info · ${stats.countered} countered`,
    },
    {
      label: 'Quoted premium',
      value: formatCurrency(stats.premium, 'USD', { maximumFractionDigits: 0 }),
      hint: `${formatCurrency(stats.avgPremium, 'USD', { maximumFractionDigits: 0 })} avg · avg risk ${stats.avgRisk.toFixed(0)}`,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Quotes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quote pipeline from submission to decision, with risk scoring and conversion.
          </p>
        </div>
        <Badge variant="outline">
          {stats.bound} bound · {formatPercent(stats.conversion, { digits: 0 })} conversion
        </Badge>
      </header>

      {/* ---------- Conversion stats ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard key={card.label} label={card.label} value={card.value} hint={card.hint} />
        ))}
      </div>

      {/* ---------- Filters ---------- */}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label htmlFor="quote-search" className="mb-1.5 block text-xs font-medium text-slate-500">
              Search quotes
            </label>
            <input
              id="quote-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Quote #, applicant, product, channel or agent…"
              className={inputClass + ' lg:max-w-md'}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDecision('all')}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition',
                decision === 'all'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-700',
              )}
            >
              All decisions
            </button>
            {DECISION_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDecision(option.value)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition',
                  decision === option.value
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
            {stats.total} quotes ·{' '}
            <span className="font-semibold text-slate-700">
              {formatCurrency(shownPremium, 'USD', { maximumFractionDigits: 0 })}
            </span>{' '}
            quoted premium
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

      {/* ---------- Quote pipeline table ---------- */}
      <Card className="!p-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <CardTitle>Quote pipeline</CardTitle>
          <Badge variant="secondary">Submission → decision → bind</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Quote #</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Requested coverage</th>
                <th className="px-3 py-3 font-medium">Risk score</th>
                <th className="px-3 py-3 font-medium">Quoted premium</th>
                <th className="px-3 py-3 font-medium">Decision</th>
                <th className="px-3 py-3 font-medium">Agent</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((quote, index) => {
                const agent = agentFor(index);
                const risk = riskMeta(quote.riskScore);
                const meta = decisionMeta(quote.decision);
                return (
                  <tr
                    key={quote.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-teal-50/40"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-semibold tabular-nums text-teal-700">{quote.number}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-400">
                        {CHANNEL_LABEL[quote.channel] ?? quote.channel} ·{' '}
                        {STATUS_LABEL[quote.status] ?? quote.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="font-medium text-slate-800">{quote.applicantName}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-400">
                        {quote.applicantEmail}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-slate-700">{quote.productName}</span>
                      <span className="mt-0.5 block text-[11px] tabular-nums text-slate-400">
                        Limit {formatCurrency(quote.coverageLimit, 'USD', { maximumFractionDigits: 0 })} ·
                        ded {formatCurrency(quote.deductible, 'USD', { maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold tabular-nums text-slate-700">
                          {quote.riskScore}
                        </span>
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${quote.riskScore}%`, background: risk.color }}
                          />
                        </div>
                        <Badge variant={risk.variant}>{risk.label}</Badge>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="font-semibold tabular-nums text-slate-800">
                        {formatCurrency(quote.premium, 'USD', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="mt-0.5 block text-[11px] tabular-nums text-slate-400">
                        {formatCurrency(quote.monthlyPremium)} / mo
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      {quote.decisionReason ? (
                        <span
                          className="mt-0.5 block max-w-[15rem] truncate text-[11px] text-slate-400"
                          title={quote.decisionReason}
                        >
                          {quote.decisionReason}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-3.5 text-slate-600">
                      {agent.name}
                      <span className="mt-0.5 block text-[11px] text-slate-400">{agent.agency}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                      {formatDate(quote.requestedAt)}
                      <span className="mt-0.5 block text-[11px] text-slate-400">
                        {quote.decidedAt
                          ? `Decided ${formatDate(quote.decidedAt)}`
                          : `Expires ${formatDate(quote.expiresAt)}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <div className="border-t border-slate-100 px-5 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">No quotes match these filters</p>
            <p className="mt-1 text-xs text-slate-500">
              Try a different decision, or clear the search.
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
