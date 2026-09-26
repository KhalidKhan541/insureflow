'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import { MOCK_ADJUSTERS, MOCK_CLAIMS } from '@/lib/mock-data';
import { cn, formatNumber } from '@/lib/utils';

const TEAL = '#0d9488';
const TEAL_SOFT = '#5eead4';

type Adjuster = (typeof MOCK_ADJUSTERS)[number];
type Claim = (typeof MOCK_CLAIMS)[number];

const OPEN_STATUSES = new Set(['reported', 'investigating', 'adjusting']);

const statusVariant: Record<string, BadgeVariant> = {
  Available: 'success',
  'At Capacity': 'warning',
  'On Leave': 'secondary',
  Mentoring: 'default',
};

const severityVariant: Record<string, BadgeVariant> = {
  Critical: 'destructive',
  High: 'warning',
  Medium: 'default',
  Low: 'success',
};

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20';

/** `84%` — percent display for a 0–100 value. */
function pct(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return '—';
  return `${value.toFixed(digits)}%`;
}

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

function loadTone(pct: number): string {
  if (pct >= 90) return 'bg-rose-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-teal-500';
}

function Rating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-1" aria-label={`${value} out of 5`}>
      <span className="text-sm leading-none tracking-tight text-teal-500">
        {'★'.repeat(Math.round(value))}
        <span className="text-slate-300">{'★'.repeat(5 - Math.round(value))}</span>
      </span>
      <span className="text-xs font-medium tabular-nums text-slate-600">{value.toFixed(1)}</span>
    </span>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="text-xs font-medium" style={{ color: entry.color }}>
          {entry.dataKey === 'caseload' ? 'Active caseload' : 'Capacity'}: {entry.value} claims
        </p>
      ))}
    </div>
  );
}

export default function AdjustersPage() {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('all');

  const specialties = useMemo(
    () => Array.from(new Set(MOCK_ADJUSTERS.map((adjuster) => adjuster.specialty))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return MOCK_ADJUSTERS.filter((adjuster) => {
      if (specialty !== 'all' && adjuster.specialty !== specialty) return false;
      if (!term) return true;
      return (
        adjuster.name.toLowerCase().includes(term) ||
        adjuster.specialty.toLowerCase().includes(term) ||
        adjuster.region.toLowerCase().includes(term)
      );
    });
  }, [query, specialty]);

  const workload = useMemo(
    () =>
      MOCK_ADJUSTERS.map((adjuster) => ({
        name: adjuster.name.split(' ').slice(-1)[0],
        caseload: adjuster.caseload,
        capacity: adjuster.capacity,
      })),
    [],
  );

  const stats = useMemo(() => {
    const totalCaseload = MOCK_ADJUSTERS.reduce((sum, a) => sum + a.caseload, 0);
    const totalCapacity = MOCK_ADJUSTERS.reduce((sum, a) => sum + a.capacity, 0);
    const avgCycle =
      MOCK_ADJUSTERS.reduce((sum, a) => sum + a.avgCycleTime, 0) / (MOCK_ADJUSTERS.length || 1);
    const avgSettlement =
      MOCK_ADJUSTERS.reduce((sum, a) => sum + a.settlementRate, 0) /
      (MOCK_ADJUSTERS.length || 1);
    return {
      totalCaseload,
      totalCapacity,
      utilisation: totalCapacity > 0 ? (totalCaseload / totalCapacity) * 100 : 0,
      avgCycle,
      avgSettlement,
      available: MOCK_ADJUSTERS.filter(
        (a) => String(a.status).toLowerCase() === 'available',
      ).length,
    };
  }, []);

  const openClaimsFor = (adjusterName: string): Claim[] =>
    MOCK_CLAIMS.filter(
      (claim) =>
        claim.adjuster === adjusterName &&
        OPEN_STATUSES.has(String(claim.status).toLowerCase()),
    );

  const cards = [
    { label: 'Adjusters', value: formatNumber(MOCK_ADJUSTERS.length), hint: `${stats.available} available now` },
    {
      label: 'Fleet utilisation',
      value: pct(stats.utilisation),
      hint: `${formatNumber(stats.totalCaseload)} of ${formatNumber(stats.totalCapacity)} slots used`,
    },
    { label: 'Avg cycle time', value: `${stats.avgCycle.toFixed(1)} days`, hint: 'Report to settlement' },
    {
      label: 'Settlement rate',
      value: pct(stats.avgSettlement),
      hint: 'Resolved without litigation',
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Adjusters</h1>
          <p className="mt-1 text-sm text-slate-500">
            Field team capacity, cycle-time performance and live caseload distribution.
          </p>
        </div>
        <Badge variant="outline">Q3 2026 performance</Badge>
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
            <label htmlFor="adjuster-search" className="mb-1.5 block text-xs font-medium text-slate-500">
              Search adjusters
            </label>
            <input
              id="adjuster-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, specialty or region…"
              className={inputClass}
            />
          </div>
          <div className="lg:w-64">
            <label htmlFor="adjuster-specialty" className="mb-1.5 block text-xs font-medium text-slate-500">
              Specialty
            </label>
            <select
              id="adjuster-specialty"
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              className={inputClass}
            >
              <option value="all">All specialties</option>
              {specialties.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              {formatNumber(filtered.length)} of {formatNumber(MOCK_ADJUSTERS.length)} shown
            </span>
            {query.trim() !== '' || specialty !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSpecialty('all');
                }}
                className="rounded-lg px-2.5 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </Card>

      {/* ---------- Workload chart ---------- */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardTitle>Workload distribution</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Active caseload against contracted capacity — {Math.round(stats.utilisation)}% fleet
              utilisation
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL }} />
              Caseload
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: TEAL_SOFT }} />
              Capacity
            </span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workload} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                width={36}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="caseload" fill={TEAL} radius={[4, 4, 0, 0]} maxBarSize={26} />
              <Bar dataKey="capacity" fill={TEAL_SOFT} radius={[4, 4, 0, 0]} maxBarSize={26}>
                {workload.map((entry) => (
                  <Cell key={entry.name} fillOpacity={0.55} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ---------- Adjuster cards ---------- */}
      {filtered.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No adjusters match these filters</p>
          <p className="mt-1 text-xs text-slate-500">Try another specialty or clear the search.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filtered.map((adjuster) => {
            const loadPct =
              adjuster.capacity > 0 ? (adjuster.caseload / adjuster.capacity) * 100 : 0;
            const openClaims = openClaimsFor(adjuster.name);
            return (
              <Card key={adjuster.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_SOFT} 100%)` }}
                    >
                      {adjuster.name
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900">{adjuster.name}</p>
                      <p className="text-xs text-slate-500">
                        {adjuster.specialty} · {adjuster.region}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant[adjuster.status] ?? 'secondary'}>
                    {adjuster.status}
                  </Badge>
                </div>

                {/* Caseload + capacity bar */}
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">Caseload</span>
                    <span className="font-semibold tabular-nums text-slate-800">
                      {adjuster.caseload} / {adjuster.capacity}
                      <span className="ml-1.5 font-normal text-slate-500">
                        {Math.round(loadPct)}%
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn('h-full rounded-full', loadTone(loadPct))}
                      style={{ width: `${Math.min(100, loadPct)}%` }}
                    />
                  </div>
                </div>

                {/* KPI row */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Avg cycle
                    </p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-slate-800">
                      {adjuster.avgCycleTime}
                      <span className="ml-1 text-xs font-normal text-slate-500">days</span>
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Settlement
                    </p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-teal-700">
                      {pct(adjuster.settlementRate)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Rating
                    </p>
                    <div className="mt-1.5">
                      <Rating value={adjuster.rating} />
                    </div>
                  </div>
                </div>

                {/* Open claims preview */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Open claims
                    </p>
                    <Badge variant="secondary">{openClaims.length} active</Badge>
                  </div>
                  {openClaims.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500">
                      No open claims — fully available for assignment.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {openClaims.slice(0, 4).map((claim) => (
                        <li
                          key={claim.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200/80 bg-slate-50/60 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-teal-700">
                              {claim.claimNumber}
                            </p>
                            <p className="truncate text-[11px] text-slate-500">
                              {claim.claimant} · {claim.lossType}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <Badge variant={severityVariant[claim.severity] ?? 'default'}>
                              {claim.severity}
                            </Badge>
                            <span className="text-xs font-semibold tabular-nums text-slate-700">
                              {compactCurrency(claim.amountClaimed)}
                            </span>
                          </div>
                        </li>
                      ))}
                      {openClaims.length > 4 ? (
                        <li className="text-center text-[11px] font-medium text-slate-400">
                          +{openClaims.length - 4} more in queue
                        </li>
                      ) : null}
                    </ul>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
