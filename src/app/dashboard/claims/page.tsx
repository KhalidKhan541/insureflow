'use client';

import { useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import { MOCK_CLAIMS } from '@/lib/mock-data';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

const TEAL = '#0d9488';

type Claim = (typeof MOCK_CLAIMS)[number];

const STATUS_OPTIONS = ['reported', 'investigating', 'adjusting', 'settled', 'denied'] as const;
const SEVERITY_OPTIONS = ['critical', 'high', 'medium', 'low'] as const;

const OPEN_STATUSES = new Set(['reported', 'investigating', 'adjusting']);

const severityVariant: Record<string, BadgeVariant> = {
  Critical: 'destructive',
  High: 'warning',
  Medium: 'default',
  Low: 'success',
};

const statusVariant: Record<string, BadgeVariant> = {
  Reported: 'outline',
  Investigating: 'warning',
  Adjusting: 'default',
  Settled: 'success',
  Denied: 'destructive',
};

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

/** `$1.2M` — compact money display for dense cards and columns. */
function compactCurrency(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function fraudTone(score: number): { label: string; variant: BadgeVariant } {
  if (score >= 70) return { label: 'High risk', variant: 'destructive' };
  if (score >= 40) return { label: 'Review', variant: 'warning' };
  return { label: 'Clear', variant: 'success' };
}

function matches(value: string | undefined, term: string): boolean {
  if (!term) return true;
  return (value ?? '').toLowerCase().includes(term);
}

export default function ClaimsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [severity, setSeverity] = useState('all');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return MOCK_CLAIMS.filter((claim) => {
      if (status !== 'all' && String(claim.status).toLowerCase() !== status) return false;
      if (severity !== 'all' && String(claim.severity).toLowerCase() !== severity) return false;
      if (!term) return true;
      return (
        matches(claim.claimNumber, term) ||
        matches(claim.policyNumber, term) ||
        matches(claim.claimant, term) ||
        matches(claim.lossType, term) ||
        matches(claim.adjuster, term)
      );
    });
  }, [query, status, severity]);

  const stats = useMemo(() => {
    const open = MOCK_CLAIMS.filter((c) => OPEN_STATUSES.has(String(c.status).toLowerCase()));
    const claimed = MOCK_CLAIMS.reduce((sum, c) => sum + c.amountClaimed, 0);
    const reserved = MOCK_CLAIMS.reduce((sum, c) => sum + c.amountReserved, 0);
    const flagged = MOCK_CLAIMS.filter((c) => c.fraudScore >= 70);
    return {
      total: MOCK_CLAIMS.length,
      open: open.length,
      critical: MOCK_CLAIMS.filter((c) => String(c.severity).toLowerCase() === 'critical').length,
      claimed,
      reserved,
      flagged: flagged.length,
      flaggedAmount: flagged.reduce((sum, c) => sum + c.amountClaimed, 0),
    };
  }, []);

  const hasFilters = query.trim() !== '' || status !== 'all' || severity !== 'all';

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setSeverity('all');
  };

  const cards = [
    {
      label: 'Total claims',
      value: formatNumber(stats.total),
      hint: `${formatNumber(stats.open)} open · ${formatNumber(stats.total - stats.open)} closed`,
      tone: 'text-slate-900',
    },
    {
      label: 'Open inventory',
      value: formatNumber(stats.open),
      hint: `${formatNumber(stats.critical)} critical severity`,
      tone: 'text-teal-700',
    },
    {
      label: 'Amount claimed',
      value: formatCurrency(stats.claimed),
      hint: 'Across all open + closed files',
      tone: 'text-slate-900',
    },
    {
      label: 'Reserved exposure',
      value: formatCurrency(stats.reserved),
      hint: `${formatNumber(stats.flagged)} fraud flags · ${compactCurrency(stats.flaggedAmount)} at risk`,
      tone: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Claims</h1>
          <p className="mt-1 text-sm text-slate-500">
            Reserve management, severity triage and fraud screening across the claim inventory.
          </p>
        </div>
        <Badge variant="outline">
          {formatNumber(stats.open)} open · updated 4 min ago
        </Badge>
      </header>

      {/* ---------- Stat cards ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
            <p className={cn('mt-2 text-2xl font-semibold tabular-nums tracking-tight', card.tone)}>
              {card.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
          </Card>
        ))}
      </div>

      {/* ---------- Filters ---------- */}
      <Card>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label
              htmlFor="claim-search"
              className="mb-1.5 block text-xs font-medium text-slate-500"
            >
              Search claims
            </label>
            <input
              id="claim-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Claim #, policy, claimant, loss type or adjuster…"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[22rem]">
            <div>
              <label htmlFor="claim-status" className="mb-1.5 block text-xs font-medium text-slate-500">
                Status
              </label>
              <select
                id="claim-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={inputClass}
              >
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="claim-severity" className="mb-1.5 block text-xs font-medium text-slate-500">
                Severity
              </label>
              <select
                id="claim-severity"
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
                className={inputClass}
              >
                <option value="all">All severities</option>
                {SEVERITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              {formatNumber(filtered.length)} of {formatNumber(stats.total)} shown
            </span>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg px-2.5 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </Card>

      {/* ---------- Claim table ---------- */}
      <Card className="!p-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <CardTitle>Claim inventory</CardTitle>
          <Badge variant="secondary">Reserve vs claimed</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1140px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Claim #</th>
                <th className="px-3 py-3 font-medium">Policy</th>
                <th className="px-3 py-3 font-medium">Claimant</th>
                <th className="px-3 py-3 font-medium">Loss type</th>
                <th className="px-3 py-3 font-medium">Claimed vs reserved</th>
                <th className="px-3 py-3 font-medium">Severity</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Fraud</th>
                <th className="px-3 py-3 font-medium">Adjuster</th>
                <th className="px-5 py-3 font-medium">Date of loss</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((claim: Claim) => {
                const ratio =
                  claim.amountClaimed > 0
                    ? Math.min(100, (claim.amountReserved / claim.amountClaimed) * 100)
                    : 0;
                const tone = fraudTone(claim.fraudScore);
                return (
                  <tr
                    key={claim.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-teal-50/40"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-semibold tabular-nums text-teal-700">
                        {claim.claimNumber}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 tabular-nums text-slate-600">{claim.policyNumber}</td>
                    <td className="px-3 py-3.5 font-medium text-slate-800">{claim.claimant}</td>
                    <td className="px-3 py-3.5 text-slate-600">{claim.lossType}</td>
                    <td className="px-3 py-3.5">
                      <div className="min-w-[150px]">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold tabular-nums text-slate-800">
                            {formatCurrency(claim.amountClaimed)}
                          </span>
                          <span className="text-[11px] tabular-nums text-slate-500">
                            {formatCurrency(claim.amountReserved)}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${ratio}%`,
                              background: `linear-gradient(90deg, ${TEAL} 0%, #5eead4 100%)`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge variant={severityVariant[claim.severity] ?? 'default'}>
                        {claim.severity}
                      </Badge>
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge variant={statusVariant[claim.status] ?? 'secondary'}>
                        {claim.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold tabular-nums text-slate-700">
                          {claim.fraudScore}
                        </span>
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              claim.fraudScore >= 70
                                ? 'bg-rose-500'
                                : claim.fraudScore >= 40
                                  ? 'bg-amber-500'
                                  : 'bg-teal-500',
                            )}
                            style={{ width: `${claim.fraudScore}%` }}
                          />
                        </div>
                        <Badge variant={tone.variant}>{tone.label}</Badge>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-slate-600">{claim.adjuster}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                      {formatDate(claim.dateOfLoss)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <div className="border-t border-slate-100 px-5 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">No claims match these filters</p>
            <p className="mt-1 text-xs text-slate-500">
              Try a different status or severity, or clear the search.
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
