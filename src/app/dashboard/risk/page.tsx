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
import MetricCard from '@/components/ui/MetricCard';
import { MOCK_RISK } from '@/lib/mock-data';
import { cn, formatDate, formatNumber, formatPercent } from '@/lib/utils';

const LEVEL_KEYS = ['low', 'medium', 'high', 'critical'] as const;
type LevelKey = (typeof LEVEL_KEYS)[number];

const LEVEL_META: Record<
  LevelKey,
  { label: string; bg: string; fg: string; border: string; heat: string; badge: BadgeVariant }
> = {
  low: { label: 'Low', bg: '#ecfdf5', fg: '#047857', border: '#a7f3d0', heat: '#10b981', badge: 'success' },
  medium: { label: 'Medium', bg: '#fffbeb', fg: '#b45309', border: '#fde68a', heat: '#f59e0b', badge: 'warning' },
  high: { label: 'High', bg: '#ffedd5', fg: '#c2410c', border: '#fed7aa', heat: '#f97316', badge: 'danger' },
  critical: { label: 'Critical', bg: '#ffe4e6', fg: '#be123c', border: '#fecdd3', heat: '#e11d48', badge: 'destructive' },
};

/** Assessment status → badge treatment (canonical vocabulary: current / stale / superseded). */
const STATUS_VARIANT: Record<string, BadgeVariant> = {
  current: 'success',
  stale: 'warning',
  superseded: 'secondary',
};

const STATUS_ORDER = ['current', 'stale', 'superseded'];

const DUE_SOON_DAYS = 90;

function normalizeLevel(value: string): LevelKey | null {
  const key = value.trim().toLowerCase();
  if ((LEVEL_KEYS as readonly string[]).includes(key)) return key as LevelKey;
  return null;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Split "Risk Engineering — Tobias Lindgren" into team + person. */
function splitAssessor(assessor: string): { person: string; team: string | null } {
  const parts = assessor.split('—').map((p) => p.trim());
  if (parts.length >= 2) {
    return { team: parts[0], person: parts.slice(1).join('—').trim() };
  }
  return { person: assessor, team: null };
}

/** Whole days from today until the given date (negative = overdue). */
function daysUntil(value: string): number | null {
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function Countdown({ value }: { value: string }) {
  const days = daysUntil(value);
  if (days === null) {
    return <span className="text-xs text-slate-400">{value}</span>;
  }

  const overdue = days < 0;
  const dueSoon = days >= 0 && days <= DUE_SOON_DAYS;
  const tone = overdue
    ? 'bg-rose-50 text-rose-600'
    : dueSoon
      ? 'bg-amber-50 text-amber-700'
      : 'bg-teal-50 text-teal-700';
  const label = overdue
    ? `${Math.abs(days)}d overdue`
    : days === 0
      ? 'Due today'
      : `${days}d`;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
        tone,
      )}
      title={formatDate(value)}
    >
      {label}
    </span>
  );
}

/** Control effectiveness from mitigationScore (0–100, higher = better). */
function ControlCell({ value }: { value: number }) {
  const fraction = value > 1 ? value / 100 : value;
  const color = fraction >= 0.6 ? '#0d9488' : fraction >= 0.4 ? '#f59e0b' : '#e11d48';

  return (
    <div className="w-24">
      <span className="text-[11px] font-semibold tabular-nums" style={{ color }}>
        {formatPercent(fraction, { digits: 0 })}
      </span>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(Math.max(fraction, 0), 1) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

function HeatBadge({ value }: { value: string }) {
  const key = normalizeLevel(value);
  if (!key) {
    return <span className="text-xs text-slate-500">{value}</span>;
  }
  const meta = LEVEL_META[key];
  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: meta.bg, color: meta.fg, borderColor: meta.border }}
    >
      {meta.label}
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
          {entry.dataKey === 'inherent' ? 'Inherent' : 'Residual'}:{' '}
          {formatNumber(entry.value)} risks
        </p>
      ))}
    </div>
  );
}

export default function RiskPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const statuses = useMemo(() => {
    const present = new Set(MOCK_RISK.map((risk) => String(risk.status).trim().toLowerCase()));
    const ordered = STATUS_ORDER.filter((value) => present.has(value));
    for (const value of present) if (!STATUS_ORDER.includes(value)) ordered.push(value);
    return ['all', ...ordered];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_RISK.filter((risk) => {
      const matchesStatus =
        status === 'all' || String(risk.status).trim().toLowerCase() === status;
      if (!matchesStatus) return false;
      if (!q) return true;
      return [
        risk.subjectName,
        risk.subjectType,
        risk.assessor,
        risk.methodology,
        String(risk.level),
        String(risk.residualLevel),
        String(risk.status),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [query, status]);

  const distribution = useMemo(
    () =>
      LEVEL_KEYS.map((level) => ({
        level: LEVEL_META[level].label,
        inherent: filtered.filter((risk) => normalizeLevel(String(risk.level)) === level).length,
        residual: filtered.filter((risk) => normalizeLevel(String(risk.residualLevel)) === level)
          .length,
        heat: LEVEL_META[level].heat,
      })),
    [filtered],
  );

  const counts = useMemo(() => {
    const acc: Record<LevelKey, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const risk of MOCK_RISK) {
      const key = normalizeLevel(String(risk.residualLevel));
      if (key) acc[key] += 1;
    }
    return acc;
  }, []);

  const horizon = useMemo(() => {
    let overdue = 0;
    let dueSoon = 0;
    const upcoming: { entity: string; nextReview: string; days: number }[] = [];
    for (const risk of MOCK_RISK) {
      const days = daysUntil(risk.nextReviewAt);
      if (days === null) continue;
      if (days < 0) overdue += 1;
      else if (days <= DUE_SOON_DAYS) dueSoon += 1;
      upcoming.push({ entity: risk.subjectName, nextReview: risk.nextReviewAt, days });
    }
    upcoming.sort((a, b) => a.days - b.days);
    return { overdue, dueSoon, upcoming: upcoming.slice(0, 4) };
  }, []);

  const avgControl =
    MOCK_RISK.length > 0
      ? MOCK_RISK.reduce((sum, risk) => sum + risk.mitigationScore, 0) / MOCK_RISK.length / 100
      : 0;

  const elevated = counts.high + counts.critical;

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Risk register</h1>
          <p className="mt-1 text-sm text-slate-500">
            Inherent exposure, control effectiveness and residual risk across the enterprise.
          </p>
        </div>
        <Badge variant="outline">{MOCK_RISK.length} risks logged</Badge>
      </header>

      {/* ---------- Stats ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Risks logged"
          value={formatNumber(MOCK_RISK.length)}
          hint={`${filtered.length} matching current filter`}
        />
        <MetricCard
          label="Elevated residual risk"
          value={formatNumber(elevated)}
          hint={`${counts.high} high · ${counts.critical} critical`}
        />
        <MetricCard
          label="Overdue reviews"
          value={formatNumber(horizon.overdue)}
          hint={`${horizon.dueSoon} due within ${DUE_SOON_DAYS} days`}
        />
        <MetricCard
          label="Avg control effectiveness"
          value={formatPercent(avgControl, { digits: 0 })}
          hint="Across assessed controls"
        />
      </div>

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
              placeholder="Search entities, exposures or assessors…"
              aria-label="Search risks"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {statuses.map((value) => {
              const active = status === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition',
                    active
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-700',
                  )}
                >
                  {value === 'all' ? 'All statuses' : capitalize(value)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
            {MOCK_RISK.length} risks
          </span>
          {(query.trim() || status !== 'all') && (
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

      {/* ---------- Distribution + review horizon ---------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Risk distribution</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Inherent exposure versus residual risk after controls · follows current filters
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                Inherent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#0d9488' }} />
                Residual
              </span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="level"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="inherent" name="Inherent" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={38} />
                <Bar dataKey="residual" name="Residual" radius={[4, 4, 0, 0]} maxBarSize={38}>
                  {distribution.map((entry) => (
                    <Cell key={entry.level} fill={entry.heat} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Review horizon</CardTitle>
            <Badge variant={horizon.overdue > 0 ? 'destructive' : 'success'}>
              {horizon.overdue > 0 ? `${horizon.overdue} overdue` : 'On schedule'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
              <p className="text-lg font-semibold tabular-nums text-rose-600">
                {formatNumber(horizon.overdue)}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">Overdue</p>
            </div>
            <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
              <p className="text-lg font-semibold tabular-nums text-amber-600">
                {formatNumber(horizon.dueSoon)}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Due in {DUE_SOON_DAYS} days
              </p>
            </div>
          </div>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Next up
          </p>
          <ul className="mt-2 space-y-2">
            {horizon.upcoming.length > 0 ? (
              horizon.upcoming.map((item) => (
                <li
                  key={`${item.entity}-${item.nextReview}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200/80 px-3 py-2"
                >
                  <span className="truncate text-xs font-medium text-slate-700">{item.entity}</span>
                  <Countdown value={item.nextReview} />
                </li>
              ))
            ) : (
              <li className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400">
                No reviews scheduled
              </li>
            )}
          </ul>
        </Card>
      </div>

      {/* ---------- Register ---------- */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <CardTitle>Risk assessment register</CardTitle>
          <Badge variant="secondary">Residual heat: low → critical</Badge>
        </div>

        {filtered.length > 0 ? (
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[1040px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <th className="pb-2 pr-4 font-semibold">Entity</th>
                  <th className="pb-2 pr-4 font-semibold">Exposure</th>
                  <th className="pb-2 pr-4 font-semibold">Inherent</th>
                  <th className="pb-2 pr-4 font-semibold">Controls</th>
                  <th className="pb-2 pr-4 font-semibold">Residual</th>
                  <th className="pb-2 pr-4 font-semibold">Assessor</th>
                  <th className="pb-2 pr-4 font-semibold">Last review</th>
                  <th className="pb-2 pr-4 font-semibold">Next review</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((risk) => {
                  const inherent = normalizeLevel(String(risk.level));
                  const statusKey = String(risk.status).trim().toLowerCase();
                  const statusVariant = STATUS_VARIANT[statusKey] ?? 'outline';
                  const { person, team } = splitAssessor(risk.assessor);

                  return (
                    <tr
                      key={risk.id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-teal-50/40"
                    >
                      <td className="py-3 pr-4">
                        <p className="text-sm font-semibold text-slate-800">{risk.subjectName}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {risk.id} · grade {risk.grade}
                        </p>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline">{capitalize(risk.subjectType)}</Badge>
                      </td>
                      <td className="py-3 pr-4">
                        {inherent ? (
                          <span className="flex items-center gap-1.5">
                            <Badge variant={LEVEL_META[inherent].badge}>
                              {LEVEL_META[inherent].label}
                            </Badge>
                            <span className="text-[11px] tabular-nums text-slate-400">
                              {risk.score}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">{risk.level}</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <ControlCell value={risk.mitigationScore} />
                      </td>
                      <td className="py-3 pr-4">
                        <HeatBadge value={String(risk.residualLevel)} />
                      </td>
                      <td className="py-3 pr-4 text-xs font-medium text-slate-600">
                        {person}
                        {team && <span className="block text-[11px] text-slate-400">{team}</span>}
                      </td>
                      <td className="py-3 pr-4 text-xs text-slate-500">
                        {formatDate(risk.assessedAt)}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-col gap-1">
                          <Countdown value={risk.nextReviewAt} />
                          <span className="text-[11px] text-slate-400">
                            {formatDate(risk.nextReviewAt)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={statusVariant}>{capitalize(statusKey)}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <CardTitle>No risks found</CardTitle>
            <p className="mt-2 text-sm text-slate-500">
              Nothing matches the current search and status filter.
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
