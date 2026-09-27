'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_UNDERWRITING, type UnderwritingCase } from '@/lib/mock-data';
import { cn, formatCurrency, formatDate, formatPercent } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DecisionKey = 'accept' | 'decline' | 'refer' | 'price-load' | 'pending';

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const DECISION_META: Record<DecisionKey, { label: string; badge: 'success' | 'destructive' | 'warning' | 'info' | 'secondary' }> = {
  accept: { label: 'Accept', badge: 'success' },
  decline: { label: 'Decline', badge: 'destructive' },
  refer: { label: 'Refer', badge: 'warning' },
  'price-load': { label: 'Price-load', badge: 'info' },
  pending: { label: 'Pending', badge: 'secondary' },
};

const DECISION_ORDER: DecisionKey[] = ['accept', 'price-load', 'refer', 'decline', 'pending'];

/** Mock decisions (approve / approve_with_conditions / decline / refer) → spec vocabulary. */
function decisionKey(c: UnderwritingCase): DecisionKey {
  switch (c.decision) {
    case 'approve':
      return 'accept';
    case 'approve_with_conditions':
      return 'price-load';
    case 'decline':
      return 'decline';
    case 'refer':
      return 'refer';
    default:
      return 'pending';
  }
}

/** Human label when a case has no decision yet (workflow status, e.g. "in_review"). */
function pendingLabel(c: UnderwritingCase): string {
  const raw = c.status.replace(/_/g, ' ');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/** "Risk score" bands — higher score = worse risk. */
const SCORE_META: Record<'low' | 'moderate' | 'elevated' | 'high', { label: string; className: string; bar: string }> = {
  low: { label: 'Low risk', className: 'text-teal-600 dark:text-teal-400', bar: 'bg-teal-500' },
  moderate: { label: 'Moderate', className: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
  elevated: { label: 'Elevated', className: 'text-orange-600 dark:text-orange-400', bar: 'bg-orange-500' },
  high: { label: 'High risk', className: 'text-rose-600 dark:text-rose-400', bar: 'bg-rose-500' },
};

function scoreBand(score: number): 'low' | 'moderate' | 'elevated' | 'high' {
  if (score <= 35) return 'low';
  if (score <= 55) return 'moderate';
  if (score <= 70) return 'elevated';
  return 'high';
}

/** Segment colors for the decision-mix bar. */
const DECISION_COLOR: Record<DecisionKey, string> = {
  accept: 'bg-teal-500',
  'price-load': 'bg-sky-500',
  refer: 'bg-amber-500',
  decline: 'bg-rose-500',
  pending: 'bg-slate-400',
};

/** Header cells for the two table breakpoints. */
const HEADERS = ['Submission', 'Applicant', 'Product', 'Coverage requested', 'Risk factors', 'Score', 'Decision', 'Underwriter', 'Date'];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function UnderwritingPage() {
  const [query, setQuery] = useState('');
  const [decision, setDecision] = useState<DecisionKey | 'all'>('all');

  const cases = MOCK_UNDERWRITING;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      if (decision !== 'all' && decisionKey(c) !== decision) return false;
      if (!q) return true;
      return (
        c.reference.toLowerCase().includes(q) ||
        c.applicantName.toLowerCase().includes(q) ||
        c.productName.toLowerCase().includes(q) ||
        (c.assignedTo ?? '').toLowerCase().includes(q) ||
        c.riskFactors.some((f) => f.label.toLowerCase().includes(q))
      );
    });
  }, [cases, query, decision]);

  // Decision-mix bar counts (all cases, not just filtered).
  const mix = useMemo(() => {
    const counts = new Map<DecisionKey, number>();
    for (const c of cases) {
      const key = decisionKey(c);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const total = cases.length;
    return DECISION_ORDER.map((key) => ({
      key,
      count: counts.get(key) ?? 0,
      pct: total > 0 ? ((counts.get(key) ?? 0) / total) * 100 : 0,
    })).filter((s) => s.count > 0);
  }, [cases]);

  const stats = useMemo(() => {
    const decided = cases.filter((c) => c.decision != null);
    const accepted = decided.filter((c) => c.decision === 'approve' || c.decision === 'approve_with_conditions');
    const referred = cases.filter((c) => decisionKey(c) === 'refer');
    const pending = cases.filter((c) => decisionKey(c) === 'pending');
    const avgScore = cases.reduce((sum, c) => sum + c.riskScore, 0) / cases.length;
    const avgCoverage = cases.reduce((sum, c) => sum + c.coverageLimit, 0) / cases.length;
    const acceptance = decided.length > 0 ? accepted.length / decided.length : 0;
    return { decided: decided.length, acceptance, pending: pending.length, referred: referred.length, avgScore, avgCoverage };
  }, [cases]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Underwriting queue</h1>
          <p className="text-sm text-muted-foreground">
            Review submissions, risk factors and pricing decisions across all products.
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-72 sm:flex-none">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            >
              <path
                d="m17 17-3.5-3.5m1.5-4.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              placeholder="Search submissions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total submissions"
          value={String(cases.length)}
          hint={`${stats.decided} decided`}
        />
        <MetricCard
          label="Acceptance rate"
          value={formatPercent(stats.acceptance, { digits: 0 })}
          hint={`${stats.referred} referred`}
        />
        <MetricCard
          label="Avg risk score"
          value={stats.avgScore.toFixed(0)}
          hint="Higher = worse risk"
        />
        <MetricCard
          label="Pending decisions"
          value={String(stats.pending)}
          hint={`Avg coverage ${formatCurrency(stats.avgCoverage)}`}
        />
      </div>

      {/* Decision mix */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Decision mix</CardTitle>
            <div className="flex flex-wrap gap-3">
              {mix.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn('h-2 w-2 rounded-full', DECISION_COLOR[s.key])} />
                  {DECISION_META[s.key].label}
                  <span className="font-medium text-foreground">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
            {mix.map((s) => (
              <div
                key={s.key}
                className={cn('h-full transition-all', DECISION_COLOR[s.key])}
                style={{ width: `${s.pct}%` }}
                title={`${DECISION_META[s.key].label}: ${s.count}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Decision filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setDecision('all')}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            decision === 'all'
              ? 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400'
              : 'border-border text-muted-foreground hover:text-foreground'
          )}
        >
          All decisions
        </button>
        {DECISION_ORDER.map((key) => {
          const count = cases.filter((c) => decisionKey(c) === key).length;
          return (
            <button
              key={key}
              onClick={() => setDecision(key)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                decision === key
                  ? 'border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {DECISION_META[key].label}
              <span className="ml-1 text-muted-foreground">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Queue — desktop table */}
      <Card className="hidden lg:block">
        <CardContent className="pt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                {HEADERS.map((h) => (
                  <th key={h} className="pb-3 pr-4 font-medium last:pr-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((c) => {
                const key = decisionKey(c);
                const meta = DECISION_META[key];
                const band = scoreBand(c.riskScore);
                const score = SCORE_META[band];
                return (
                  <tr key={c.id} className="transition-colors hover:bg-muted/40">
                    <td className="py-3 pr-4 font-mono text-xs font-medium">{c.reference}</td>
                    <td className="py-3 pr-4">
                      <div className="font-medium">{c.applicantName}</div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{c.productName}</td>
                    <td className="py-3 pr-4 font-medium tabular-nums">
                      {formatCurrency(c.coverageLimit)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex max-w-56 flex-wrap gap-1">
                        {c.riskFactors.slice(0, 3).map((f) => (
                          <span
                            key={f.label}
                            title={f.detail}
                            className={cn(
                              'rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                              f.impact === 'negative'
                                ? 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                : f.impact === 'positive'
                                ? 'border-teal-500/40 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                : 'border-border text-muted-foreground'
                            )}
                          >
                            {f.label}
                          </span>
                        ))}
                        {c.riskFactors.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{c.riskFactors.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 text-xs font-semibold tabular-nums">{c.riskScore}</span>
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn('h-full rounded-full', score.bar)}
                            style={{ width: `${c.riskScore}%` }}
                          />
                        </div>
                        <span className={cn('text-[10px] font-medium', score.className)}>{score.label}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={meta.badge}>
                        {key === 'pending' ? pendingLabel(c) : meta.label}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{c.assignedTo ?? '—'}</td>
                    <td className="whitespace-nowrap py-3 text-xs text-muted-foreground">
                      {formatDate(c.decidedAt ?? c.submittedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No submissions match the current filters.</p>
          )}
        </CardContent>
      </Card>

      {/* Queue — tablet / mobile cards */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((c) => {
          const key = decisionKey(c);
          const meta = DECISION_META[key];
          const band = scoreBand(c.riskScore);
          const score = SCORE_META[band];
          return (
            <Card key={c.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{c.reference}</p>
                    <p className="font-medium">{c.applicantName}</p>
                    <p className="text-xs text-muted-foreground">{c.productName}</p>
                  </div>
                  <Badge variant={meta.badge} className="shrink-0">
                    {key === 'pending' ? pendingLabel(c) : meta.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Coverage requested</p>
                    <p className="font-semibold tabular-nums">{formatCurrency(c.coverageLimit)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(c.decidedAt ?? c.submittedAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Underwriter</p>
                    <p className="font-medium">{c.assignedTo ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Risk score</p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums">{c.riskScore}</span>
                      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                        <div className={cn('h-full rounded-full', score.bar)} style={{ width: `${c.riskScore}%` }} />
                      </div>
                    </div>
                    <p className={cn('text-[10px] font-medium', score.className)}>{score.label}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {c.riskFactors.slice(0, 4).map((f) => (
                    <span
                      key={f.label}
                      title={f.detail}
                      className={cn(
                        'rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                        f.impact === 'negative'
                          ? 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : f.impact === 'positive'
                          ? 'border-teal-500/40 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                          : 'border-border text-muted-foreground'
                      )}
                    >
                      {f.label}
                    </span>
                  ))}
                  {c.riskFactors.length > 4 && (
                    <span className="text-[10px] text-muted-foreground">+{c.riskFactors.length - 4}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No submissions match the current filters.</p>
        )}
      </div>
    </div>
  );
}
