'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import { MOCK_LITIGATION } from '@/lib/mock-data';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

type LitigationCase = (typeof MOCK_LITIGATION)[number];

const STATUS_OPTIONS = ['pre-trial', 'discovery', 'trial', 'settled', 'closed'] as const;

const statusVariant: Record<string, BadgeVariant> = {
  'Pre-Trial': 'outline',
  Discovery: 'default',
  Trial: 'warning',
  Settled: 'success',
  Closed: 'secondary',
};

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

/** `$1.2M` — compact money display for dense cards and list rows. */
function compactCurrency(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function toDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1);
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return toDate(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((toDate(iso).getTime() - today.getTime()) / 86_400_000);
}

function hearingTone(
  days: number,
  status: string,
): { label: string; variant: BadgeVariant; dot: string } {
  if (['settled', 'closed'].includes(status)) {
    return { label: 'Concluded', variant: 'secondary', dot: 'bg-slate-400' };
  }
  if (days < 0) return { label: 'Overdue', variant: 'destructive', dot: 'bg-rose-500' };
  if (days === 0) return { label: 'Today', variant: 'destructive', dot: 'bg-rose-500' };
  if (days <= 7) return { label: `In ${days}d`, variant: 'destructive', dot: 'bg-rose-500' };
  if (days <= 30) return { label: `In ${days}d`, variant: 'warning', dot: 'bg-amber-500' };
  return { label: `In ${days}d`, variant: 'success', dot: 'bg-teal-500' };
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-800">{children}</dd>
    </div>
  );
}

export default function LitigationPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return MOCK_LITIGATION.filter((item) => {
      if (status !== 'all' && String(item.status).toLowerCase() !== status) return false;
      if (!term) return true;
      return (
        item.caseNumber.toLowerCase().includes(term) ||
        item.claimNumber.toLowerCase().includes(term) ||
        item.defendant.toLowerCase().includes(term) ||
        item.counsel.toLowerCase().includes(term) ||
        item.jurisdiction.toLowerCase().includes(term)
      );
    });
  }, [query, status]);

  const selected = useMemo(() => {
    if (!filtered.length) return null;
    return filtered.find((item) => item.id === selectedId) ?? filtered[0];
  }, [filtered, selectedId]);

  const stats = useMemo(() => {
    const active = MOCK_LITIGATION.filter(
      (item) => !['settled', 'closed'].includes(String(item.status).toLowerCase()),
    );
    const upcoming = MOCK_LITIGATION.filter((item) => {
      const days = daysUntil(item.nextHearing);
      return days >= 0 && days <= 30 && !['settled', 'closed'].includes(String(item.status).toLowerCase());
    });
    return {
      total: MOCK_LITIGATION.length,
      active: active.length,
      amount: active.reduce((sum, item) => sum + item.amountAtStake, 0),
      upcoming: upcoming.length,
      trials: MOCK_LITIGATION.filter((item) => String(item.status).toLowerCase() === 'trial').length,
    };
  }, []);

  const cards = [
    { label: 'Litigation cases', value: formatNumber(stats.total), hint: `${stats.active} still active` },
    { label: 'Amount at stake', value: compactCurrency(stats.amount), hint: 'Active matters only' },
    { label: 'Hearings · 30 days', value: formatNumber(stats.upcoming), hint: 'Calendared next month' },
    { label: 'At trial', value: formatNumber(stats.trials), hint: 'Currently in trial posture' },
  ];

  const selectedDays = selected ? daysUntil(selected.nextHearing) : 0;
  const selectedStatus = selected ? String(selected.status).toLowerCase() : '';
  const selectedTone = hearingTone(selectedDays, selectedStatus);
  const selectedConcluded = ['settled', 'closed'].includes(selectedStatus);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Litigation</h1>
          <p className="mt-1 text-sm text-slate-500">
            Subrogation and dispute matters linked to claims, with hearing calendar and exposure.
          </p>
        </div>
        <Badge variant="outline">Legal operations · Q3 2026</Badge>
      </header>

      {/* ---------- Stat cards ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
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
            <label htmlFor="case-search" className="mb-1.5 block text-xs font-medium text-slate-500">
              Search cases
            </label>
            <input
              id="case-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Case #, claim #, defendant, counsel or jurisdiction…"
              className={inputClass}
            />
          </div>
          <div className="lg:w-64">
            <label htmlFor="case-status" className="mb-1.5 block text-xs font-medium text-slate-500">
              Status
            </label>
            <select
              id="case-status"
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
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              {formatNumber(filtered.length)} of {formatNumber(stats.total)} shown
            </span>
            {query.trim() !== '' || status !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setStatus('all');
                }}
                className="rounded-lg px-2.5 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </Card>

      {/* ---------- Case list + detail ---------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3 !p-0">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <CardTitle>Case docket</CardTitle>
            <Badge variant="secondary">{formatNumber(filtered.length)} matters</Badge>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-medium text-slate-700">No cases match these filters</p>
              <p className="mt-1 text-xs text-slate-500">
                Try a different status or clear the search.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setStatus('all');
                }}
                className="mt-4 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const days = daysUntil(item.nextHearing);
                const tone = hearingTone(days, String(item.status).toLowerCase());
                const isActive = selected?.id === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        'w-full px-5 py-4 text-left transition',
                        isActive ? 'bg-teal-50/70' : 'hover:bg-slate-50',
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold tabular-nums text-teal-700">
                              {item.caseNumber}
                            </span>
                            <Badge variant={statusVariant[item.status] ?? 'secondary'}>
                              {item.status}
                            </Badge>
                            <Badge variant="outline">{item.jurisdiction}</Badge>
                          </div>
                          <p className="mt-1.5 truncate text-sm font-medium text-slate-800">
                            {item.defendant}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {item.counsel} · filed {formatDate(item.filingDate)}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <span className="text-sm font-semibold tabular-nums text-slate-800">
                            {compactCurrency(item.amountAtStake)}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 ring-1 ring-inset ring-slate-200">
                            <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} />
                            <span className="text-[11px] font-medium text-slate-600">
                              {formatDate(item.nextHearing)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* ---------- Case detail panel ---------- */}
        <div className="xl:col-span-2">
          {selected ? (
            <Card className="sticky top-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Case file
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                    {selected.caseNumber}
                  </p>
                </div>
                <Badge variant={statusVariant[selected.status] ?? 'secondary'}>
                  {selected.status}
                </Badge>
              </div>

              {/* Next hearing countdown */}
              <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                    {selectedConcluded ? 'Last hearing' : 'Next hearing'}
                  </p>
                  <span className="flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-full', selectedTone.dot)} />
                    <Badge variant={selectedTone.variant}>{selectedTone.label}</Badge>
                  </span>
                </div>
                <p className="mt-2 text-xl font-semibold tabular-nums text-slate-900">
                  {formatDate(selected.nextHearing)}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {selectedConcluded
                    ? `${selected.status} · matter resolved and off the active docket`
                    : selectedDays < 0
                      ? `${Math.abs(selectedDays)} days ago — confirm continuance status`
                      : selectedDays === 0
                        ? 'Hearing is scheduled for today'
                        : `In ${selectedDays} day${selectedDays === 1 ? '' : 's'} · ${selected.jurisdiction}`}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Amount at stake
                  </p>
                  <p className="mt-1 text-base font-semibold tabular-nums text-slate-800">
                    {formatCurrency(selected.amountAtStake)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Filed
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {formatDate(selected.filingDate)}
                  </p>
                </div>
              </div>

              <dl className="mt-4">
                <DetailRow label="Linked claim">
                  <Link
                    href={`/dashboard/claims?claim=${encodeURIComponent(selected.claimNumber)}`}
                    className="font-semibold text-teal-700 underline decoration-teal-300 underline-offset-2 transition hover:text-teal-800"
                  >
                    {selected.claimNumber}
                  </Link>
                </DetailRow>
                <DetailRow label="Defendant">{selected.defendant}</DetailRow>
                <DetailRow label="Outside counsel">{selected.counsel}</DetailRow>
                <DetailRow label="Firm">{selected.counselFirm}</DetailRow>
                <DetailRow label="Jurisdiction">{selected.jurisdiction}</DetailRow>
                <DetailRow label="Venue">{selected.venue}</DetailRow>
                <DetailRow label="Case owner">{selected.owner}</DetailRow>
              </dl>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Summary
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{selected.notes}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
                >
                  Open matter
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Export brief
                </button>
              </div>
            </Card>
          ) : (
            <Card className="py-12 text-center">
              <p className="text-sm font-medium text-slate-700">No case selected</p>
              <p className="mt-1 text-xs text-slate-500">
                Select a matter from the docket to view its detail.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
