'use client';

import { useMemo, useState } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_UNDERWRITING } from '@/lib/mock-data';
import { cn, formatCurrency, formatDate, formatNumber, formatPercent } from '@/lib/utils';

type DecisionKey = 'accept' | 'decline' | 'refer' | 'price-load';

const DECISION_ORDER: DecisionKey[] = ['accept', 'price-load', 'refer', 'decline'];

const DECISION_META: Record<DecisionKey, { label: string; variant: BadgeVariant; color: string }> = {
  accept: { label: 'Accept', variant: 'success', color: '#0d9488' },
  'price-load': { label: 'Price load', variant: 'default', color: '#0ea5e9' },
  refer: { label: 'Refer', variant: 'warning', color: '#f59e0b' },
  decline: { label: 'Decline', variant: 'destructive', color: '#e11d48' },
};

function normalizeDecision(value: string): DecisionKey | null {
  const key = value.trim().toLowerCase();
  return (DECISION_ORDER as string[]).includes(key) ? (key as DecisionKey) : null;
}

function scoreColor(score: number): string {
  if (score >= 70) return '#0d9488';
  if (score >= 50) return '#f59e0b';
  return '#e11d48';
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative h-12 w-12 shrink-0" title={`Score ${score}`}>
      <svg viewBox="0 0 40 40" className="h-12 w-12 -rotate-90" aria-hidden="true">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-slate-700">
        {score}
      </span>
    </div>
  );
}

export default function UnderwritingPage() {
  const [query, setQuery] = useState('');
  const [decision, setDecision] = useState('all');

  const counts = useMemo(() => {
    const acc: Record<DecisionKey, number> = { accept: 0, decline: 0, refer: 0, 'price-load': 0 };
    for (const submission of MOCK_UNDERWRITING) {
      const key = normalizeDecision(String(submission.decision));
      if (key) acc[key] += 1;
    }
    return acc;
  }, []);

  const total = MOCK_UNDERWRITING.length;
  const avgScore =
    total > 0
      ? MOCK_UNDERWRITING.reduce((sum, s) => sum + s.score, 0) / total
      : 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_UNDERWRITING.filter((submission) => {
      const key = normalizeDecision(String(submission.decision));
      const matchesDecision = decision === 'all' || key === decision;
      if (!matchesDecision) return false;
      if (!q) return true;
      return [
        submission.submission,
        submission.applicant,
        submission.product,
        submission.underwriter,
        ...(submission.riskFactors ?? []),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [query, decision]);

  const decisionFilters = ['all', ...DECISION_ORDER];

  const clearFilters = () => {
    setQuery('');
    setDecision('all');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Underwriting</h1>
          <p className="mt-1 text-sm text-slate-500">
            Submission queue with risk scoring, referral flags and decision history.
          </p>
        </div>
        <Badge variant="outline">Rolling 30 days · Avg score {Math.round(avgScore)}</Badge>
      </header>

      {/* ---------- Decision stats ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Submissions in queue"
          value={formatNumber(total)}
          hint={`${filtered.length} matching current filter`}
        />
        <MetricCard
          label="Accepted"
          value={formatNumber(counts.accept)}
          hint={`${formatPercent(total ? counts.accept / total : 0, { digits: 0 })} of queue`}
        />
        <MetricCard
          label="Declined"
          value={formatNumber(counts.decline)}
          hint={`${formatPercent(total ? counts.decline / total : 0, { digits: 0 })} of queue`}
        />
        <MetricCard
          label="Avg risk score"
          value={Math.round(avgScore)}
          hint="Accept threshold ≥ 70 · Refer 50–69"
        />
      </div>

      {/* ---------- Decision mix ---------- */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <CardTitle>Decision mix</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              How the queue has been dispositioned across all underwriters
            </p>
          </div>
          <Badge variant="secondary">{formatNumber(total)} total</Badge>
        </div>

        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
          {DECISION_ORDER.map((key) => (
            <div
              key={key}
              style={{
                width: `${total ? (counts[key] / total) * 100 : 0}%`,
                background: DECISION_META[key].color,
              }}
              title={`${DECISION_META[key].label}: ${counts[key]}`}
            />
          ))}
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DECISION_ORDER.map((key) => (
            <li
              key={key}
              className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-xs"
            >
              <span className="flex items-center gap-2 text-slate-600">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: DECISION_META[key].color }}
                />
                {DECISION_META[key].label}
              </span>
              <span className="font-semibold tabular-nums text-slate-800">{counts[key]}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* ---------- Filters ---------- */}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search submissions, applicants, underwriters…"
              aria-label="Search submissions"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {decisionFilters.map((value) => {
              const active = decision === value;
              const label =
                value === 'all' ? 'All decisions' : DECISION_META[value as DecisionKey].label;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDecision(value)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition',
                    active
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-700',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
            {total} submissions
          </span>
          {(query.trim() || decision !== 'all') && (
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

      {/* ---------- Queue ---------- */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <CardTitle>Submission queue</CardTitle>
          <Badge variant="secondary">Score out of 100</Badge>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="hidden gap-4 border-b border-slate-100 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 md:grid md:grid-cols-[1.5fr_1.2fr_110px_1fr]">
              <span>Submission / applicant</span>
              <span>Risk factors</span>
              <span>Score</span>
              <span>Decision</span>
            </div>

            <ul>
              {filtered.map((submission) => {
                const key = normalizeDecision(String(submission.decision));
                const meta = key ? DECISION_META[key] : null;

                return (
                  <li
                    key={submission.id}
                    className="grid gap-4 border-b border-slate-100 py-4 last:border-b-0 md:grid-cols-[1.5fr_1.2fr_110px_1fr] md:items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-teal-600">
                        {submission.submission}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                        {submission.applicant}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {submission.product} ·{' '}
                        <span className="font-medium text-slate-600">
                          {formatCurrency(submission.coverageRequested)}
                        </span>{' '}
                        coverage
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(submission.riskFactors ?? []).map((factor) => (
                        <Badge key={factor} variant="outline">
                          {factor}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <ScoreGauge score={submission.score} />
                      <span className="text-[11px] leading-tight text-slate-400">
                        {submission.score >= 70
                          ? 'Accept band'
                          : submission.score >= 50
                            ? 'Refer band'
                            : 'Decline band'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-1.5">
                      <Badge variant={meta?.variant ?? 'outline'}>
                        {meta?.label ?? String(submission.decision)}
                      </Badge>
                      <div className="text-xs">
                        <p className="font-medium text-slate-600">{submission.underwriter}</p>
                        <p className="text-slate-400">{formatDate(submission.date)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="py-12 text-center">
            <CardTitle>No submissions found</CardTitle>
            <p className="mt-2 text-sm text-slate-500">
              Nothing matches the current search and decision filter.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
